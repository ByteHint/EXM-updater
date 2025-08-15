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
};

export default api;
