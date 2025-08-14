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
    signOut: () => void;

    // Multi-step authentication flow
    signIn: (email: string, password: string) => Promise<boolean>;
    signUp: (email: string, password: string) => Promise<boolean>;
    verifyOtp: (otp: string) => Promise<boolean>;
    forgotPassword: (email: string) => Promise<boolean>;
    resetPassword: (newPassword: string) => Promise<boolean>;

    // OAuth for direct login
    googleLogin: () => Promise<void>;
    discordLogin: () => Promise<void>;

    handleOAuth: (provider: "google" | "discord") => Promise<void>;

    // Utility actions
    clearError: () => void;
    resetAuthFlow: () => void;
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
     * Checks for a stored token and validates it with the backend. Essential for app startup.
     */
    validateSession: async () => {
        if (!get().isLoading) set({ isLoading: true });
        const token = localStorage.getItem("auth_token");

        if (!token) {
            return set({ isLoading: false, isAuthenticated: false, user: null });
        }

        const response = await apiClient.validateToken();
        if (response.success) {
            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                authFlowStatus: "idle",
            });
        } else {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                authFlowStatus: "idle",
            });
        }
    },

    /**
     * Signs a user in directly with their credentials and hardware ID.
     * @returns `true` on successful login, `false` otherwise.
     */
    signIn: async (email, password) => {
        set({ isLoading: true, error: null, authFlowStatus: "idle" });

        const hardwareId = await window.api.invoke("get-hardware-id");

        const response = await apiClient.signIn(email, password, hardwareId);

        if (response.success && response.token) {
            localStorage.setItem("auth_token", response.token);
            set({ user: response.user, isAuthenticated: true, isLoading: false });
            return true;
        }
        set({ error: response.message || "Sign in failed.", isLoading: false });
        return false;
    },

    /**
     * Starts the sign-up process. On success, transitions the UI to the OTP verification step.
     * @returns `true` if the sign-up request was accepted, `false` otherwise.
     */
    signUp: async (email, password) => {
        set({ isLoading: true, error: null });

        const hardwareId = await window.api.invoke("get-hardware-id");
        const response = await apiClient.signUp(email, password, hardwareId);

        if (response.success) {
            // Don't log in yet; move to the OTP step and store the email for verification.
            set({ isLoading: false, authFlowStatus: "awaiting-otp", flowEmail: email });
            return true;
        }
        set({ error: response.message || "Sign up failed.", isLoading: false });
        return false;
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

        if (response.success) {
            // If the API returns a token, it means sign-up is complete and we can log in.
            if (response.success && response.token) {
                localStorage.setItem("auth_token", response.token);
                set({
                    user: response.user,
                    isAuthenticated: true,
                    isLoading: false,
                    authFlowStatus: "idle",
                    flowEmail: null,
                });
            } else {
                // Otherwise, it was for a password reset. Move to the next step.
                set({ isLoading: false, authFlowStatus: "awaiting-password-reset" });
            }
            return true;
        }
        set({ error: response.message || "Invalid OTP.", isLoading: false });
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
    signOut: () => {
        apiClient.logout();
        localStorage.removeItem("auth_token");
        set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
            authFlowStatus: "idle",
            flowEmail: null,
        });
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
     * Generic handler for OAuth pop-up flows.
     */
    handleOAuth: async (provider: "google" | "discord") => {
        set({ isLoading: true, error: null });

        try {
            // 1. Get the auth URL from your server (this is unchanged).
            const urlResponse =
                provider === "google"
                    ? await apiClient.getGoogleAuthUrl()
                    : await apiClient.getDiscordAuthUrl();

            if (!urlResponse.success || !urlResponse.authUrl) {
                throw new Error(urlResponse.message || `Could not get ${provider} auth URL.`);
            }

            // 2. Call our new, robust IPC function. This handles everything.
            const authResult = await window.api.openOAuthWindow(urlResponse.authUrl);

            // THE FIX: Check for the full user object now.
            if (authResult.success && authResult.token) {
                // We got everything we need! No need for another API call.
                localStorage.setItem("auth_token", authResult.token);
                // Directly set the user state from the result.
                set({
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                    authFlowStatus: "idle",
                });
            } else if (authResult.message && !authResult.message.includes("cancelled")) {
                throw new Error(authResult.message);
            }
        } catch (err: any) {
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
}));
