import { app, protocol, BrowserWindow } from "electron";
import { resolve } from "path";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { createAppWindow } from "./app";
import { registerAuthIPC } from "./authIPC";

app.commandLine.appendSwitch("--no-sandbox");
app.commandLine.appendSwitch("--disable-gpu-sandbox");
app.commandLine.appendSwitch("--disable-software-rasterizer");
app.commandLine.appendSwitch("--disable-background-timer-throttling");
app.commandLine.appendSwitch("--disable-backgrounding-occluded-windows");
app.commandLine.appendSwitch("--disable-renderer-backgrounding");

// Register the custom protocol scheme early
protocol.registerSchemesAsPrivileged([
    { scheme: "exmapp", privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

// Ensure single instance to properly handle deep links on Windows
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
}

let pendingOAuthData: string | null = null;

function sendOAuthToRenderer(data: string): void {
    const win = BrowserWindow.getAllWindows()[0];
    if (win && !win.isDestroyed()) {
        if (win.webContents.isLoadingMainFrame()) {
            pendingOAuthData = data;
            win.webContents.once("did-finish-load", () => {
                const target = BrowserWindow.getAllWindows()[0];
                if (pendingOAuthData && target && !target.isDestroyed()) {
                    target.webContents.send("oauth-callback", pendingOAuthData);
                    pendingOAuthData = null;
                    target.focus();
                }
            });
        } else {
            win.webContents.send("oauth-callback", data);
            win.focus();
        }
    } else {
        pendingOAuthData = data;
    }
}

function handleDeepLinkUrl(urlString: string): void {
    try {
        const url = new URL(urlString);
        if (url.protocol !== "exmapp:") return;
        if (url.pathname === "/auth/callback") {
            const data = url.searchParams.get("data");
            if (data) {
                sendOAuthToRenderer(data);
            }
        }
    } catch (e) {
        console.error("[DEEPLINK] Failed to process:", urlString, e);
    }
}

app.on("second-instance", (_event, argv) => {
    const deepLink = argv.find((arg) => arg.startsWith("exmapp://"));
    if (deepLink) handleDeepLinkUrl(deepLink);
});

app.whenReady().then(() => {
    electronApp.setAppUserModelId("com.exm.bytehint");

    createAppWindow();
    registerAuthIPC();
    // Ensure the app handles our custom protocol on all platforms
    const isDev = !app.isPackaged;
    if (process.platform === "win32") {
        // In dev on Windows, you must pass arguments to electron.exe so it knows your app path
        if (isDev) {
            // Register both standard and a dev-specific scheme to avoid collisions
            app.setAsDefaultProtocolClient("exmapp", process.execPath, [resolve(process.argv[1])]);
            app.setAsDefaultProtocolClient("exmapp-dev", process.execPath, [
                resolve(process.argv[1]),
            ]);
        } else {
            app.setAsDefaultProtocolClient("exmapp");
        }
    } else {
        // macOS/Linux
        app.setAsDefaultProtocolClient("exmapp");
        if (!app.isPackaged) app.setAsDefaultProtocolClient("exmapp-dev");
    }
    app.on("browser-window-created", (_e, window) => {
        optimizer.watchWindowShortcuts(window);
        window.on("focus", () => {
            // On focus after returning from browser, re-send any pending data
            if (pendingOAuthData) {
                sendOAuthToRenderer(pendingOAuthData);
                pendingOAuthData = null;
            }
        });
    });

    // Handle a deep link passed on first launch (Windows)
    if (process.platform === "win32") {
        const deepLink = process.argv.find((arg) => arg.startsWith("exmapp://"));
        if (deepLink) handleDeepLinkUrl(deepLink);
    }
});

app.on("window-all-closed", () => {
    app.quit();
});

// Handle exmapp:// deep links when app is already running (Windows passes it via process.argv)
// Handle deep links on macOS
app.on("open-url", (_event, url) => {
    handleDeepLinkUrl(url);
});

// Flush pending OAuth data once a window finishes loading
app.on("browser-window-created", (_e, window) => {
    window.webContents.once("did-finish-load", () => {
        if (pendingOAuthData) {
            sendOAuthToRenderer(pendingOAuthData);
            pendingOAuthData = null;
        }
    });
});
