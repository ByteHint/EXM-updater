import { ipcMain, BrowserWindow } from "electron";

// This is a new interface to define the shape of the data we expect from the URL.
interface AuthCallbackData {
    success: boolean;
    message: string;
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
        avatar: string;
        oauthProvider: string;
    };
}

function handleOAuth(
    url: string,
): Promise<AuthCallbackData | { success: boolean; message: string }> {
    return new Promise((resolve) => {
        const authWindow = new BrowserWindow({
            /* ... window options ... */
        });
        authWindow.loadURL(url);
        const { webContents } = authWindow;

        // ADD THIS LINE FOR DEBUGGING
        console.log(`[AUTH IPC] Opened OAuth window with initial URL: ${url}`);

        const onNavigate = async (_event: Electron.Event, navigationUrl: string) => {
            // THIS IS THE MOST IMPORTANT LOG
            console.log(`[AUTH IPC] Intercepted navigation to: ${navigationUrl}`);

            // This is the URL we are *expecting*
            const successUrl = "http://localhost:5000/api/v1/auth/callback/success";

            if (navigationUrl.startsWith(successUrl)) {
                console.log(`[AUTH IPC] SUCCESS URL DETECTED! Processing token...`); // <-- We want to see this log
                try {
                    const urlParams = new URL(navigationUrl).searchParams;
                    const dataString = urlParams.get("data");

                    if (dataString) {
                        const authData = JSON.parse(decodeURIComponent(dataString));
                        console.log(`[AUTH IPC] Successfully parsed auth data. Resolving promise.`);
                        resolve(authData);
                    } else {
                        console.error(
                            `[AUTH IPC] ERROR: 'data' parameter was not found in the success URL.`,
                        );
                        resolve({ success: false, message: "Data not found in callback URL." });
                    }
                } catch (error) {
                    console.error(`[AUTH IPC] ERROR: Failed to parse callback data.`, error);
                    resolve({ success: false, message: "Failed to parse callback data." });
                } finally {
                    if (!authWindow.isDestroyed()) authWindow.close();
                }
            }
        };

        authWindow.on("closed", () => {
            console.log(`[AUTH IPC] OAuth window was closed manually.`);
            resolve({ success: false, message: "Authentication cancelled by user." });
        });

        webContents.on("will-navigate", onNavigate);
    });
}

export const registerAuthIPC = () => {
    ipcMain.handle("open-oauth-window", (_event, url: string) => {
        return handleOAuth(url);
    });
};
