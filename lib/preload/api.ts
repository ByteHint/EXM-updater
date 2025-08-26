import { ipcRenderer } from "electron";

const api = {
    send: (channel: string, ...args: any[]) => {
        ipcRenderer.send(channel, ...args);
    },
    receive: (channel: string, func: (...args: any[]) => void) => {
        ipcRenderer.on(channel, (_, ...args) => func(...args));
    },
    invoke: (channel: string, ...args: any[]) => {
        return ipcRenderer.invoke(channel, ...args);
    },
    removeAllListeners: (channel: string) => {
        ipcRenderer.removeAllListeners(channel);
    },
    openOAuthWindow: (
        url: string,
    ): Promise<{ success: boolean; token?: string; message?: string }> => {
        return ipcRenderer.invoke("open-oauth-window", url);
    },
    onOAuthCallback: (callback: (data: string) => void) => {
        ipcRenderer.on("oauth-callback", (_, data) => callback(data));
    },
    removeOAuthCallback: () => {
        ipcRenderer.removeAllListeners("oauth-callback");
    },
    onCheckAuthStatus: (callback: () => void) => {
        ipcRenderer.on("check-auth-status", () => callback());
    },
    removeCheckAuthStatus: () => {
        ipcRenderer.removeAllListeners("check-auth-status");
    },
    // System monitoring methods
    getSystemInfo: () => {
        return ipcRenderer.invoke("get-system-info");
    },
    getCpuUsage: () => {
        return ipcRenderer.invoke("get-cpu-usage");
    },
    getMemoryUsage: () => {
        return ipcRenderer.invoke("get-memory-usage");
    },
    getGpuUsage: () => {
        return ipcRenderer.invoke("get-gpu-usage");
    },
    getHardwareId: () => {
        return ipcRenderer.invoke("get-hardware-id");
    },
};

export default api;
