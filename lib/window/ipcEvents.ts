import { type BrowserWindow, ipcMain, shell } from "electron";
import os from "os";
import { machineIdSync } from "node-machine-id";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const handleIPC = (channel: string, handler: (...args: any[]) => void) => {
    ipcMain.handle(channel, handler);
};

export const registerWindowIPC = (mainWindow: BrowserWindow) => {
    // Hide the menu bar
    mainWindow.setMenuBarVisibility(true);

    // Register window IPC
    handleIPC("init-window", () => {
        const { width, height } = mainWindow.getBounds();
        const minimizable = mainWindow.isMinimizable();
        const maximizable = mainWindow.isMaximizable();
        const platform = os.platform();

        return { width, height, minimizable, maximizable, platform };
    });

    handleIPC("is-window-minimizable", () => mainWindow.isMinimizable());
    handleIPC("is-window-maximizable", () => mainWindow.isMaximizable());
    handleIPC("window-minimize", () => mainWindow.minimize());
    handleIPC("window-maximize", () => mainWindow.maximize());
    handleIPC("window-close", () => mainWindow.close());
    handleIPC("window-maximize-toggle", () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });

    handleIPC("get-hardware-id", () => {
        const id = machineIdSync();
        return id;
    });

    // System monitoring handlers
    handleIPC("get-system-info", async () => {
        try {
            const platform = os.platform();
            const arch = os.arch();
            const cpus = os.cpus();
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            
            // Get GPU info
            let gpuModel = "Unknown GPU";
            if (platform === "win32") {
                try {
                    const { stdout } = await execAsync('wmic path win32_VideoController where "AdapterCompatibility like \'%NVIDIA%\' OR AdapterCompatibility like \'%AMD%\' OR AdapterCompatibility like \'%Radeon%\'" get Name /value', { timeout: 3000 });
                    const match = stdout.match(/Name=(.+)/);
                    if (match && match[1].trim()) {
                        gpuModel = match[1].trim();
                    }
                } catch (error) {
                    console.log("Could not get GPU model:", error);
                }
            }
            
            return {
                platform,
                arch,
                cpu: {
                    model: cpus[0]?.model || "Unknown",
                    cores: cpus.length,
                    speed: cpus[0]?.speed || 0
                },
                memory: {
                    total: totalMem,
                    free: freeMem,
                    used: totalMem - freeMem
                },
                gpu: {
                    model: gpuModel
                }
            };
        } catch (error) {
            console.error("Error getting system info:", error);
            return null;
        }
    });

    handleIPC("get-cpu-usage", async () => {
        try {
            if (os.platform() === "win32") {
                const { stdout } = await execAsync("wmic cpu get loadpercentage /value", { timeout: 3000 });
                const match = stdout.match(/LoadPercentage=(\d+)/);
                if (match) {
                    const cpuUsage = parseInt(match[1]);
                    console.log(`CPU Usage: ${cpuUsage}%`);
                    return cpuUsage;
                }
                console.log("CPU Usage: WMIC failed, no data available");
                return 0;
            } else {
                // For non-Windows systems, use loadavg as approximation
                const loadavg = os.loadavg()[0]; // 1-minute load average
                const cpuCount = os.cpus().length;
                const usage = Math.min(100, Math.round((loadavg / cpuCount) * 100));
                console.log(`CPU Usage (non-Windows): ${usage}%`);
                return usage;
            }
        } catch (error) {
            console.error("Error getting CPU usage:", error);
            return 0;
        }
    });

    handleIPC("get-memory-usage", () => {
        try {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const usagePercentage = (usedMem / totalMem) * 100;
            
            console.log(`Memory: ${Math.round(usagePercentage)}% (${Math.round(usedMem/1024/1024/1024)}GB / ${Math.round(totalMem/1024/1024/1024)}GB)`);
            
            return {
                total: totalMem,
                used: usedMem,
                free: freeMem,
                percentage: Math.round(usagePercentage)
            };
        } catch (error) {
            console.error("Error getting memory usage:", error);
            return {
                total: 0,
                used: 0,
                free: 0,
                percentage: 0
            };
        }
    });

    // GPU usage targeting dedicated GPU (NVIDIA/AMD)
    handleIPC("get-gpu-usage", async () => {
        try {
            if (os.platform() === "win32") {
                // Method 1: Try nvidia-smi for NVIDIA GPUs
                try {
                    const { stdout } = await execAsync('nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits', { timeout: 3000 });
                    const lines = stdout.trim().split('\n');
                    // Get the first discrete GPU (usually index 0 in nvidia-smi)
                    const gpuUsage = parseInt(lines[0]);
                    if (!isNaN(gpuUsage)) {
                        console.log(`GPU Usage (NVIDIA): ${gpuUsage}%`);
                        return gpuUsage;
                    }
                } catch (e1: any) {
                    console.log("NVIDIA GPU monitoring failed:", e1.message);
                }

                // Method 2: Try PowerShell for dedicated GPU specifically
                try {
                    const cmd = 'powershell -Command "Get-Counter \\"\\GPU Engine(*)\\Utilization Percentage\\" | Select-Object -ExpandProperty CounterSamples | Where-Object {$_.InstanceName -match \\"pid_.*_luid_.*_phys_1\\"} | Measure-Object -Property CookedValue -Average | Select-Object -ExpandProperty Average"';
                    const { stdout } = await execAsync(cmd, { timeout: 5000 });
                    const gpuUsage = parseFloat(stdout.trim());
                    if (!isNaN(gpuUsage) && gpuUsage >= 0) {
                        console.log(`GPU Usage (PowerShell dedicated): ${Math.round(gpuUsage)}%`);
                        return Math.round(gpuUsage);
                    }
                } catch (e2: any) {
                    console.log("PowerShell dedicated GPU monitoring failed:", e2.message);
                }

                // Method 3: Try WMI for discrete GPU
                try {
                    const cmd = 'wmic path Win32_VideoController where "AdapterCompatibility like \'%NVIDIA%\' OR AdapterCompatibility like \'%AMD%\' OR AdapterCompatibility like \'%Radeon%\'" get LoadPercentage /value';
                    const { stdout } = await execAsync(cmd, { timeout: 3000 });
                    const match = stdout.match(/LoadPercentage=(\d+)/);
                    if (match) {
                        const gpuUsage = parseInt(match[1]);
                        if (!isNaN(gpuUsage)) {
                            console.log(`GPU Usage (WMI discrete): ${gpuUsage}%`);
                            return gpuUsage;
                        }
                    }
                } catch (e3: any) {
                    console.log("WMI discrete GPU monitoring failed:", e3.message);
                }
            }

            // No hardware monitoring available
            console.log("GPU Usage: No hardware monitoring available");
            return 0;
        } catch (error) {
            console.error("Error getting GPU usage:", error);
            return 0;
        }
    });

    // OAuth callback handler
    handleIPC("oauth-callback", (_event, data) => {
        console.warn(`[IPC] OAuth callback received: ${data}`);
        // Send the data to the renderer process
        mainWindow.webContents.send("oauth-callback", data);
        return { success: true };
    });

    const webContents = mainWindow.webContents;
    handleIPC("web-undo", () => webContents.undo());
    handleIPC("web-redo", () => webContents.redo());
    handleIPC("web-cut", () => webContents.cut());
    handleIPC("web-copy", () => webContents.copy());
    handleIPC("web-paste", () => webContents.paste());
    handleIPC("web-delete", () => webContents.delete());
    handleIPC("web-select-all", () => webContents.selectAll());
    handleIPC("web-reload", () => webContents.reload());
    handleIPC("web-force-reload", () => webContents.reloadIgnoringCache());
    handleIPC("web-toggle-devtools", () => webContents.toggleDevTools());
    handleIPC("web-actual-size", () => webContents.setZoomLevel(0));
    handleIPC("web-zoom-in", () => webContents.setZoomLevel(webContents.zoomLevel + 0.5));
    handleIPC("web-zoom-out", () => webContents.setZoomLevel(webContents.zoomLevel - 0.5));
    handleIPC("web-toggle-fullscreen", () => mainWindow.setFullScreen(!mainWindow.fullScreen));
    handleIPC("web-open-url", (_e, url) => shell.openExternal(url));
};
