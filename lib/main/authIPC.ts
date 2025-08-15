import { ipcMain, shell } from "electron";

// This is a new interface to define the shape of the data we expect from the URL.
interface AuthCallbackData {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        avatar: string;
        authProvider: string;
    };
}

function handleOAuth(
    url: string,
): Promise<AuthCallbackData | { success: boolean; message: string }> {
    return new Promise((resolve) => {
        console.warn(`[AUTH IPC] Opening OAuth URL in default browser: ${url}`);

        // Open the OAuth URL in the default browser
        shell.openExternal(url);

        // For now, we'll resolve with a success message indicating the browser was opened
        // The actual OAuth flow will be handled by the OAuthCallback component when the user
        // completes the flow and gets redirected back to the app
        resolve({
            success: true,
            message:
                "OAuth window opened in your default browser. Please complete the authentication there.",
        });
    });
}

export const registerAuthIPC = () => {
    ipcMain.handle("open-oauth-window", (_event, url: string) => {
        return handleOAuth(url);
    });
};
