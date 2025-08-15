import { BrowserWindow, shell, app, protocol, net } from "electron";
import { join } from "path";
import { registerWindowIPC } from "@/lib/window/ipcEvents";
import appIcon from "@/resources/build/icon.png?asset";
import { pathToFileURL } from "url";

protocol.registerSchemesAsPrivileged([
    { scheme: "exmapp", privileges: { standard: true, secure: true, supportFetchAPI: true } },
    { scheme: "exmapp-dev", privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

let mainWindow: BrowserWindow | null = null;

export function createAppWindow(): void {
    registerResourcesProtocol();
    registerOAuthProtocol();

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 762,
        show: false,
        backgroundColor: "#0D0D13",
        icon: appIcon,
        frame: false,
        titleBarStyle: "hiddenInset",
        title: "Electron React App",
        maximizable: false,
        resizable: false,
        webPreferences: {
            preload: join(__dirname, "../preload/preload.js"),
            sandbox: false,
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
            experimentalFeatures: false,
            backgroundThrottling: false,
        },
    });

    registerWindowIPC(mainWindow);
    // protocol.registerSchemesAsPrivileged([
    //     { scheme: "exmapp", privileges: { standard: true, secure: true, supportFetchAPI: true } },
    // ]);

    mainWindow.once("ready-to-show", () => {
        mainWindow!.show();
        mainWindow!.focus();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    // Listen for window focus events to detect when user returns from browser
    mainWindow.on("focus", () => {
        console.warn("[APP] Window focused - checking for OAuth completion...");
        // Send a message to the renderer to check authentication status
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send("check-auth-status");
        }
    });

    if (!app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
        mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    }
}

function registerResourcesProtocol() {
    protocol.handle("res", async (request) => {
        try {
            const url = new URL(request.url);
            const fullPath = join(url.hostname, url.pathname.slice(1));
            const filePath = join(__dirname, "../../resources", fullPath);

            const fileUrl = pathToFileURL(filePath).toString();
            return net.fetch(fileUrl);
        } catch (error) {
            console.error("Protocol error:", error);
            return new Response("Resource not found", {
                status: 404,
                headers: { "Content-Type": "text/plain" },
            });
        }
    });
}

function registerOAuthProtocol() {
    protocol.handle("exmapp", async (request) => {
        try {
            const url = new URL(request.url);
            console.warn(`[OAUTH PROTOCOL] Received callback: ${url.toString()}`);

            // Handle OAuth callback
            if (url.pathname === "/auth/callback") {
                const data = url.searchParams.get("data");
                if (data) {
                    console.warn(`[OAUTH PROTOCOL] OAuth data received: ${data}`);

                    // Send the data to the renderer process
                    if (mainWindow && !mainWindow.isDestroyed()) {
                        mainWindow.webContents.send("oauth-callback", data);
                        console.warn(`[OAUTH PROTOCOL] Data sent to renderer process`);

                        // Focus the main window
                        mainWindow.focus();
                    } else {
                        console.warn(`[OAUTH PROTOCOL] No valid window found to send data to`);
                    }
                } else {
                    console.warn(`[OAUTH PROTOCOL] No data parameter found in callback`);
                }
            }

            // Return a simple success page with a manual-launch button (helps when OS blocks auto-open)
            return new Response(
                `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Authentication Successful</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 50px; 
                            background: #0A0A0F; 
                            color: white; 
                        }
                        .success { color: #4CAF50; }
                        .message { margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <h1 class="success">✅ Authentication Successful!</h1>
                    <p class="message">You may close this window.</p>
                    <p class="message">If the desktop app does not open automatically, click the button below:</p>
                    <button id="open" style="padding: 8px 12px; cursor: pointer;">Open Desktop App</button>
                    <script>
                        const params = new URLSearchParams(window.location.search);
                        const data = params.get('data');
                        document.getElementById('open').addEventListener('click', () => {
                            if (data) {
                                window.location.href = 'exmapp://auth/callback?data=' + encodeURIComponent(data);
                            }
                        });
                        // Try to open once automatically; some browsers require gesture
                        setTimeout(() => {
                            try {
                                if (data) window.location.href = 'exmapp://auth/callback?data=' + encodeURIComponent(data);
                            } catch {
        // Ignore errors in this context
    }
                        }, 100);
                    </script>
                </body>
                </html>
            `,
                {
                    headers: { "Content-Type": "text/html" },
                },
            );
        } catch (error: any) {
            console.error("OAuth protocol error:", error?.message || error);
            return new Response(
                `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Error</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 50px; 
                            background: #0A0A0F; 
                            color: white; 
                        }
                        .error { color: #f44336; }
                    </style>
                </head>
                <body>
                    <h1 class="error">❌ Error</h1>
                    <p>OAuth callback error: ${error?.message || "unknown error"}</p>
                </body>
                </html>
            `,
                {
                    headers: { "Content-Type": "text/html" },
                },
            );
        }
    });
}
