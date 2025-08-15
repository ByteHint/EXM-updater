import { app, protocol } from "electron";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { createAppWindow } from "./app";
import { registerAuthIPC } from "./authIPC";

app.commandLine.appendSwitch("--no-sandbox");
app.commandLine.appendSwitch("--disable-gpu-sandbox");
app.commandLine.appendSwitch("--disable-software-rasterizer");
app.commandLine.appendSwitch("--disable-background-timer-throttling");
app.commandLine.appendSwitch("--disable-backgrounding-occluded-windows");
app.commandLine.appendSwitch("--disable-renderer-backgrounding");

app.whenReady().then(() => {
    electronApp.setAppUserModelId("com.exm.bytehint");

    // protocol.registerSchemesAsPrivileged([
    //     { scheme: "exmapp", privileges: { standard: true, secure: true, supportFetchAPI: true } },
    // ]);
    createAppWindow();
    registerAuthIPC();
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });
});

app.on("window-all-closed", () => {
    app.quit();
});
