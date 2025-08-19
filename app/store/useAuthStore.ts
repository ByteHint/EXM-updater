// app/store/useAuthStore.ts

import { create } from "zustand";
// Ensure the alias points to your API client file, e.g., "@/lib/apiClient"
import * as apiClient from "@/app/lib/apiClient";

// --- TYPE DEFINITIONS ---

/**
 * Defines the structure of the authenticated user object.
 */
type User = {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    authProvider: string;
};

/**
 * Tracks which UI screen to show during a multi-step authentication process.
 * - `idle`: The default state, showing the main Sign In / Sign Up forms.
 * - `awaiting-otp`: The user has submitted a form and now needs to enter an OTP.
 * - `awaiting-password-reset`: The user has verified a password reset OTP and now needs to enter a new password.
 */
type AuthFlowStatus = "idle" | "awaiting-otp" | "awaiting-password-reset";

/**
 * Defines the shape of the state managed by the store.
 */
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    authFlowStatus: AuthFlowStatus;
    flowEmail: string | null; // Stores the user's email during a multi-step flow (e.g., for OTP verification).
}

/**
 * Defines all the actions (functions) that can be called to modify the store's state.
 */
interface AuthActions {
    // Core session management
    validateSession: () => Promise<void>;
    signOut: () => Promise<void>;

    // Multi-step authentication flow
    signIn: (email: string, password: string) => Promise<boolean>;
    signUp: (email: string, password: string) => Promise<boolean>;
    verifyOtp: (otp: string) => Promise<boolean>;
    forgotPassword: (email: string) => Promise<boolean>;
    resetPassword: (newPassword: string) => Promise<boolean>;
    resendOtp: () => Promise<boolean>;

    // OAuth for direct login
    googleLogin: () => Promise<void>;
    discordLogin: () => Promise<void>;

    handleOAuth: (provider: "google" | "discord") => Promise<void>;

    // Utility actions
    clearError: () => void;
    resetAuthFlow: () => void;

    // Setters for OAuth callback
    setUser: (user: User | null) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;

    // OAuth callback handling
    handleOAuthCallback: (data: string) => void;
    initializeOAuthListener: () => void;
    cleanupOAuthListener: () => void;

    // Polling for OAuth status
    pollForAuthStatus: () => Promise<void>;
    manualRefreshAuth: () => Promise<void>;
}

// --- ZUSTAND STORE CREATION ---

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    // --- INITIAL STATE ---
    user: null,
    isAuthenticated: false,
    isLoading: true, // App always starts in a loading state to validate session
    error: null,
    authFlowStatus: "idle",
    flowEmail: null,

    // --- ACTIONS ---

    /**
     * Validates the current session by checking the stored token
     */
    validateSession: async () => {
        const token = localStorage.getItem("auth_token");

        if (!token) {
            console.warn("[VALIDATE SESSION] No token found");
            set({ isAuthenticated: false, user: null, isLoading: false });
            return;
        }

        // Check if token looks valid (basic JWT format check)
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
            console.error("[VALIDATE SESSION] Token format invalid - not a valid JWT");
            localStorage.removeItem("auth_token");
            set({
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: "Invalid token format",
            });
            return;
        }

        try {
            console.warn("[VALIDATE SESSION] Validating token...");
            console.warn(`[VALIDATE SESSION] Token preview: ${token.substring(0, 50)}...`);
            const response = await apiClient.validateToken();

            if (response.success && response.user) {
                console.warn(
                    "[VALIDATE SESSION] Token valid, user authenticated:",
                    response.user.email,
                );
                set({
                    user: response.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            } else {
                console.warn("[VALIDATE SESSION] Token invalid, clearing session");
                console.warn("[VALIDATE SESSION] Response:", response);
                localStorage.removeItem("auth_token");
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: response.message || "Session expired",
                });
            }
        } catch (error) {
            console.error("[VALIDATE SESSION] Error validating session:", error);
            localStorage.removeItem("auth_token");
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: "Failed to validate session",
            });
        }
    },

    /**
     * Polls for authentication status (used as fallback for OAuth)
     */
    pollForAuthStatus: async () => {
        console.warn("[OAUTH POLL] Starting auth status polling...");
        let pollCount = 0;
        const maxPolls = 30; // 1 minute at 2-second intervals
        const pollInterval = setInterval(async () => {
            pollCount++;
            console.warn(`[OAUTH POLL] Polling attempt ${pollCount}/${maxPolls}...`);

            try {
                await get().validateSession();

                // If we're authenticated, stop polling
                if (get().isAuthenticated) {
                    console.warn("[OAUTH POLL] Authentication detected, stopping polling");
                    clearInterval(pollInterval);
                    return;
                }

                // If we've reached max polls, stop and show error
                if (pollCount >= maxPolls) {
                    clearInterval(pollInterval);
                    console.warn(`[OAUTH POLL] Polling stopped after ${maxPolls} attempts`);
                    set({
                        error: "OAuth authentication timeout. Please try again.",
                        isLoading: false,
                        authFlowStatus: "idle",
                    });
                }
            } catch (error) {
                console.error(`[OAUTH POLL] Error during polling attempt ${pollCount}:`, error);
            }
        }, 2000);
    },

    /**
     * Signs a user in directly with their credentials and hardware ID.
     * @returns `true` on successful login, `false` otherwise.
     */
    signIn: async (email, password) => {
        set({ isLoading: true, error: null, authFlowStatus: "idle" });

        try {
            // Get hardware ID if in Electron environment
            let hardwareId: string | undefined = undefined;
            if (typeof window !== "undefined" && window.api) {
                hardwareId = await window.api.invoke("get-hardware-id");
            }

            const response = await apiClient.signIn(email, password, hardwareId);

            if (response.success && response.token) {
                localStorage.setItem("auth_token", response.token);
                set({
                    user: response.user,
                    isAuthenticated: true,
                    isLoading: false,
                    authFlowStatus: "idle",
                    flowEmail: null,
                });
                return true;
            } else if (response.requiresOtp) {
                // User needs to verify OTP first
                set({
                    isLoading: false,
                    authFlowStatus: "awaiting-otp",
                    flowEmail: email,
                    error: null,
                });
                return false;
            }

            set({ error: response.message || "Sign in failed.", isLoading: false });
            return false;
        } catch (error: any) {
            console.error("Error in signIn:", error);
            set({ error: error.message || "Sign in failed.", isLoading: false });
            return false;
        }
    },

    /**
     * Starts the sign-up process. On success, transitions the UI to the OTP verification step.
     * @returns `true` if the sign-up request was accepted, `false` otherwise.
     */
    signUp: async (email, password) => {
        console.warn("SignUp function called with:", { email, password });
        set({ isLoading: true, error: null });

        try {
            console.warn("Getting hardware ID...");
            let hardwareId: string | undefined = undefined;
            if (typeof window !== "undefined" && window.api) {
                hardwareId = await window.api.invoke("get-hardware-id");
                console.warn("Hardware ID received:", hardwareId);
            } else {
                console.warn("Hardware ID not available (web mode)");
            }

            console.warn("Calling API client signUp...");
            const response = await apiClient.signUp(email, password, hardwareId);
            console.warn("API response received:", response);

            if (response.success) {
                // Don't log in yet; move to the OTP step and store the email for verification.
                set({
                    isLoading: false,
                    authFlowStatus: "awaiting-otp",
                    flowEmail: email,
                    error: null,
                });
                return true;
            }
            set({ error: response.message || "Sign up failed.", isLoading: false });
            return false;
        } catch (error: any) {
            console.error("Error in signUp:", error);
            set({ error: error.message || "Sign up failed.", isLoading: false });
            return false;
        }
    },

    /**
     * Verifies an OTP for the email stored during the flow. Handles both sign-up and password reset.
     * @returns `true` on success, `false` otherwise.
     */
    verifyOtp: async (otp) => {
        const email = get().flowEmail;
        if (!email) {
            return (
                set({ error: "An unexpected error occurred. Please restart the process." }), false
            );
        }

        set({ isLoading: true, error: null });
        const response = await apiClient.verifyOtp(email, otp);

        if (response.success && response.token) {
            // OTP verification successful and we got a token - user is now logged in
            localStorage.setItem("auth_token", response.token);
            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                authFlowStatus: "idle",
                flowEmail: null,
            });
            return true;
        } else if (response.success) {
            // OTP verified but no token (password reset flow)
            set({ isLoading: false, authFlowStatus: "awaiting-password-reset" });
            return true;
        }

        set({ error: response.message || "Invalid OTP.", isLoading: false });
        return false;
    },

    /**
     * Resends OTP to the email stored in flowEmail.
     * @returns `true` on success, `false` otherwise.
     */
    resendOtp: async () => {
        const email = get().flowEmail;
        if (!email) {
            return (
                set({ error: "An unexpected error occurred. Please restart the process." }), false
            );
        }

        set({ isLoading: true, error: null });
        const response = await apiClient.resendOtp(email);

        if (response.success) {
            set({ isLoading: false, error: null });
            return true;
        }

        set({ error: response.message || "Failed to resend OTP.", isLoading: false });
        return false;
    },

    /**
     * Starts the forgot password process. On success, transitions the UI to the OTP verification step.
     * @returns `true` if the request was accepted, `false` otherwise.
     */
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        const response = await apiClient.forgotPassword(email);

        if (response.success) {
            set({ isLoading: false, authFlowStatus: "awaiting-otp", flowEmail: email });
            return true;
        }
        set({ error: response.message || "Could not process request.", isLoading: false });
        return false;
    },

    /**
     * Completes the password reset flow by submitting the new password. Logs the user in on success.
     * @returns `true` on success, `false` otherwise.
     */
    resetPassword: async (newPassword) => {
        const email = get().flowEmail;
        if (!email) {
            return (
                set({ error: "An unexpected error occurred. Please restart the process." }), false
            );
        }

        set({ isLoading: true, error: null });
        const response = await apiClient.resetPassword(email, newPassword);

        if (response.success && response.token && response.user) {
            localStorage.setItem("auth_token", response.token);
            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                authFlowStatus: "idle",
                flowEmail: null,
            });
            return true;
        }
        set({ error: response.message || "Could not reset password.", isLoading: false });
        return false;
    },

    /**
     * Logs the user out, clears all tokens and session data from the state and storage.
     */
    signOut: async () => {
        // Set loading state during logout
        set({ isLoading: true });

        try {
            // Call the backend logout API to invalidate the session
            await apiClient.logout();
            console.warn("[LOGOUT] Backend logout successful");
        } catch (error) {
            console.error("Backend logout failed:", error);
            // Continue with local cleanup even if backend call fails
        }

        // Clear local storage and state regardless of backend response
        localStorage.removeItem("auth_token");

        // Clear any other potential auth-related storage
        sessionStorage.clear();

        // Clean up OAuth listeners if in Electron environment
        if (typeof window !== "undefined" && window.api) {
            try {
                get().cleanupOAuthListener();
            } catch (error) {
                console.warn("[LOGOUT] Error cleaning up OAuth listeners:", error);
            }
        }

        // Reset all auth state
        set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
            authFlowStatus: "idle",
            flowEmail: null,
        });

        console.warn("[LOGOUT] Local state cleared successfully");
    },

    /**
     * A utility to manually reset the authentication UI flow back to the default 'idle' state.
     */
    resetAuthFlow: () => {
        set({ authFlowStatus: "idle", flowEmail: null, error: null, isLoading: false });
    },

    /**
     * A utility to clear any visible error messages from the UI.
     */
    clearError: () => {
        set({ error: null });
    },

    // --- OAuth Section ---
    /**
     * Generic handler for OAuth flows using default browser.
     */
    handleOAuth: async (provider: "google" | "discord") => {
        set({ isLoading: true, error: null });

        try {
            console.warn(`[OAUTH] Starting ${provider} OAuth process...`);

            // Check if we're in Electron environment
            if (typeof window === "undefined" || !window.api) {
                throw new Error(
                    "OAuth is only available in the desktop app. Please use the desktop version.",
                );
            }

            // 1. Get hardware ID first
            const hardwareId = await window.api.invoke("get-hardware-id");
            console.warn(`[OAUTH] Hardware ID: ${hardwareId}`);

            // 2. Get the auth URL from your server with hardwareId
            const urlResponse =
                provider === "google"
                    ? await apiClient.getGoogleAuthUrl(hardwareId)
                    : await apiClient.getDiscordAuthUrl(hardwareId);

            console.warn(`[OAUTH] URL response:`, urlResponse);

            if (!urlResponse.success || !urlResponse.authUrl) {
                throw new Error(urlResponse.message || `Could not get ${provider} auth URL.`);
            }

            console.warn(`[OAUTH] Got auth URL: ${urlResponse.authUrl}`);

            // 3. Open the URL in the default browser
            console.warn(`[OAUTH] Opening OAuth URL in default browser...`);
            const authResult = (await window.api.openOAuthWindow(urlResponse.authUrl)) as any;
            console.warn(`[OAUTH] IPC result:`, authResult);

            if (authResult.success) {
                console.warn(
                    `[OAUTH] Browser opened successfully. User should complete OAuth in browser.`,
                );

                // Start polling BACKEND pending status using hardwareId for a robust, one-instance flow
                const hardwareId = await window.api.invoke("get-hardware-id");
                let pollCount = 0;
                const maxPolls = 180; // 6 minutes at 2-second intervals
                const pollInterval = setInterval(async () => {
                    pollCount++;
                    try {
                        const status = await apiClient.getPendingAuthStatus(hardwareId);
                        if (status.success && status.user && status.token) {
                            clearInterval(pollInterval);
                            localStorage.setItem("auth_token", status.token);
                            set({
                                user: status.user,
                                isAuthenticated: true,
                                isLoading: false,
                                error: null,
                                authFlowStatus: "idle",
                            });
                            return;
                        }
                    } catch {
                        // Ignore errors in this context
                    }
                    if (pollCount >= maxPolls) {
                        clearInterval(pollInterval);
                        set({
                            error: "OAuth authentication timeout. Please try again.",
                            isLoading: false,
                        });
                    }
                }, 2000);

                set({
                    isLoading: false,
                    error: null,
                    authFlowStatus: "idle",
                });
            } else {
                throw new Error(authResult.message || "Failed to open OAuth URL in browser");
            }
        } catch (err: any) {
            console.error(`[OAUTH] Error:`, err);
            set({ error: err.message || "OAuth process failed.", isLoading: false });
        }

        set({ isLoading: false });
    },

    googleLogin: async () => {
        await get().handleOAuth("google");
    },
    discordLogin: async () => {
        await get().handleOAuth("discord");
    },

    // --- OAuth Callback Handling ---
    /**
     * Handles OAuth callback data received from the custom protocol
     */
    handleOAuthCallback: (data: string) => {
        try {
            console.warn(`[OAUTH CALLBACK] Received data: ${data}`);
            const authData = JSON.parse(decodeURIComponent(data));

            if (authData.success && authData.token && authData.user) {
                // Store the token - ensure it's properly formatted
                const token = authData.token.trim();
                console.warn(`[OAUTH CALLBACK] Storing token: ${token.substring(0, 20)}...`);
                localStorage.setItem("auth_token", token);

                // Verify token was stored correctly
                const storedToken = localStorage.getItem("auth_token");
                console.warn(
                    `[OAUTH CALLBACK] Stored token verification: ${storedToken ? storedToken.substring(0, 20) + "..." : "null"}`,
                );

                // Update auth state
                set({
                    user: authData.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                    authFlowStatus: "idle",
                });

                console.warn(
                    `[OAUTH CALLBACK] Authentication successful for user: ${authData.user.email}`,
                );

                // Clear any existing error messages
                setTimeout(() => {
                    set({ error: null });
                }, 1000);
            } else {
                // Handle error
                set({
                    error: authData.message || "OAuth authentication failed",
                    isLoading: false,
                    authFlowStatus: "idle",
                });
                console.error(`[OAUTH CALLBACK] Authentication failed: ${authData.message}`);
            }
        } catch (error) {
            console.error("Error processing OAuth callback:", error);
            set({
                error: "Failed to process authentication callback",
                isLoading: false,
                authFlowStatus: "idle",
            });
        }
    },

    /**
     * Initializes the OAuth callback listener
     */
    initializeOAuthListener: () => {
        console.warn(`[OAUTH] Initializing OAuth callback listener...`);

        // Check if window.api is available (Electron environment)
        if (typeof window !== "undefined" && window.api) {
            window.api.onOAuthCallback((data) => {
                get().handleOAuthCallback(data);
            });

            // Listen for auth status check events (when user returns from browser)
            window.api.onCheckAuthStatus(() => {
                console.warn(`[OAUTH] Auth status check triggered - validating session...`);
                get().validateSession();
                // Also start polling as a fallback
                get().pollForAuthStatus();
            });
            console.warn(`[OAUTH] OAuth callback listener initialized successfully`);
        } else {
            console.warn(
                `[OAUTH] window.api not available - running in web mode or Electron not ready`,
            );
        }

        // Add message listener for OAuth success from browser
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === "OAUTH_SUCCESS") {
                console.warn("[OAUTH] Received OAuth success message from browser");
                const authDataString = encodeURIComponent(JSON.stringify(event.data.data));
                get().handleOAuthCallback(authDataString);
            }
        };

        window.addEventListener("message", handleMessage);

        // Store the handler for cleanup
        (window as any).__oauthMessageHandler = handleMessage;
    },

    /**
     * Cleans up the OAuth callback listener
     */
    cleanupOAuthListener: () => {
        console.warn(`[OAUTH] Cleaning up OAuth callback listener...`);

        // Check if window.api is available
        if (typeof window !== "undefined" && window.api) {
            window.api.removeOAuthCallback();
            window.api.removeCheckAuthStatus();
            console.warn(`[OAUTH] OAuth callback listener cleaned up successfully`);
        } else {
            console.warn(`[OAUTH] window.api not available during cleanup`);
        }

        // Remove message listener
        if ((window as any).__oauthMessageHandler) {
            window.removeEventListener("message", (window as any).__oauthMessageHandler);
            delete (window as any).__oauthMessageHandler;
        }
    },

    // --- Setters for OAuth callback ---
    setUser: (user) => set({ user }),
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // --- Manual refresh ---
    manualRefreshAuth: async () => {
        console.warn("[MANUAL REFRESH] Manually refreshing authentication status...");
        try {
            await get().validateSession();
            if (get().isAuthenticated) {
                console.warn("[MANUAL REFRESH] Authentication confirmed after manual refresh");
            } else {
                console.warn("[MANUAL REFRESH] No authentication found after manual refresh");
            }
        } catch (error) {
            console.error("[MANUAL REFRESH] Error during manual refresh:", error);
        }
    },
}));
