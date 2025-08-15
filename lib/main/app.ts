import { BrowserWindow, shell, app, protocol, net } from "electron";
import { join } from "path";
import { registerWindowIPC } from "@/lib/window/ipcEvents";
import appIcon from "@/resources/build/icon.png?asset";
import { pathToFileURL } from "url";

protocol.registerSchemesAsPrivileged([
    { scheme: "exmapp", privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);
export function createAppWindow(): void {
    registerResourcesProtocol();
    const mainWindow = new BrowserWindow({
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
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
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
