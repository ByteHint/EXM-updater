/// <reference types="electron-vite/node" />

declare module "*.css" {
    const content: string;
    export default content;
}

declare module "*.png" {
    const content: string;
    export default content;
}

declare module "*.jpg" {
    const content: string;
    export default content;
}

declare module "*.jpeg" {
    const content: string;
    export default content;
}

declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "*.web" {
    const content: string;
    export default content;
}

// Electron API types
declare global {
    interface Window {
        electron: {
            platform: string;
            versions: NodeJS.ProcessVersions;
        };
        api: {
            send: (channel: string, ...args: any[]) => void;
            receive: (channel: string, func: (...args: any[]) => void) => void;
            invoke: (channel: string, ...args: any[]) => Promise<any>;
            removeAllListeners: (channel: string) => void;
            openOAuthWindow: (
                url: string,
            ) => Promise<{ success: boolean; token?: string; message?: string }>;
            onOAuthCallback: (callback: (data: string) => void) => void;
            removeOAuthCallback: () => void;
            onCheckAuthStatus: (callback: () => void) => void;
            removeCheckAuthStatus: () => void;
            // System monitoring methods
            getSystemInfo: () => Promise<any>;
            getCpuUsage: () => Promise<number>;
            getMemoryUsage: () => Promise<any>;
            getGpuUsage: () => Promise<number>;
            getHardwareId: () => Promise<string>;
            // Maintenance
            clearTempFiles?: () => Promise<{ success: boolean; removedFiles: number; removedDirs: number; errors: number; tempDir: string }>;
        };
    }
}
