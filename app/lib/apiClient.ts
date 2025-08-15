// Modern API client with TypeScript support
const API_URL = "http://localhost:5000/api/v1";

// Types
interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    token?: string;
    user?: any;
    authUrl?: string;
    error?: string;
    requiresOtp?: boolean;
}

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    authProvider: string;
}

// Generic API request function
async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {},
): Promise<ApiResponse<T>> {
    try {
        const token = localStorage.getItem("auth_token");
        const defaultHeaders: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            defaultHeaders["Authorization"] = `Bearer ${token}`;
            console.warn(
                `[API REQUEST] Adding Authorization header: Bearer ${token.substring(0, 20)}...`,
            );
        } else {
            console.warn(`[API REQUEST] No token found in localStorage`);
        }

        const config: RequestInit = {
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            ...options,
        };

        console.warn(`[API REQUEST] Making request to: ${API_URL}${endpoint}`);
        console.warn(`[API REQUEST] Headers:`, config.headers);

        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        console.warn(`[API REQUEST] Response:`, data);

        return {
            success: response.ok,
            ...data,
        };
    } catch (error) {
        console.error("API Request Error:", error);
        return {
            success: false,
            message: "Network error. Please check if the backend is running.",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

// Authentication functions
export async function signUp(
    email: string,
    password: string,
    hardwareId?: string,
): Promise<ApiResponse> {
    return apiRequest("/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, hardwareId }),
    });
}

export async function verifyOtp(email: string, otp: string): Promise<ApiResponse> {
    return apiRequest("/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
    });
}

export async function resendOtp(email: string): Promise<ApiResponse> {
    return apiRequest("/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function signIn(
    email: string,
    password: string,
    hardwareId?: string,
): Promise<ApiResponse> {
    return apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({ email, password, hardwareId }),
    });
}

export async function forgotPassword(email: string): Promise<ApiResponse> {
    return apiRequest("/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function resetPassword(email: string, newPassword: string): Promise<ApiResponse> {
    return apiRequest("/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, newPassword }),
    });
}

// OAuth functions
export async function getGoogleAuthUrl(hardwareId?: string): Promise<ApiResponse> {
    console.warn(`[API] Requesting Google auth URL with hardwareId: ${hardwareId}`);
    const params = hardwareId ? `?hardwareId=${encodeURIComponent(hardwareId)}` : "";
    const response = await apiRequest(`/auth/google${params}`, {
        method: "GET",
    });
    console.warn(`[API] Google auth URL response:`, response);
    return response;
}

export async function getDiscordAuthUrl(hardwareId?: string): Promise<ApiResponse> {
    console.warn(`[API] Requesting Discord auth URL with hardwareId: ${hardwareId}`);
    const params = hardwareId ? `?hardwareId=${encodeURIComponent(hardwareId)}` : "";
    const response = await apiRequest(`/auth/discord${params}`, {
        method: "GET",
    });
    console.warn(`[API] Discord auth URL response:`, response);
    return response;
}

export async function handleOAuthCallback(
    provider: "google" | "discord",
    code: string,
    state?: string,
): Promise<ApiResponse> {
    const params = new URLSearchParams({ code });
    if (state) {
        params.append("state", state);
    }

    return apiRequest(`/auth/${provider}/callback?${params.toString()}`);
}

// Poll pending OAuth result for desktop app using hardwareId/state
export async function getPendingAuthStatus(
    hardwareId: string,
    state?: string,
): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (hardwareId) params.append("hardwareId", hardwareId);
    if (state) params.append("state", state);
    return apiRequest(`/auth/pending?${params.toString()}`, { method: "GET" });
}

// Token validation
export async function validateToken(): Promise<ApiResponse> {
    const token = localStorage.getItem("auth_token");
    console.warn(
        `[VALIDATE TOKEN] Token from localStorage: ${token ? token.substring(0, 20) + "..." : "null"}`,
    );

    if (!token) {
        console.warn(`[VALIDATE TOKEN] No token found in localStorage`);
        return {
            success: false,
            message: "No authentication token found",
        };
    }

    // Don't add Authorization header here since apiRequest handles it automatically
    return apiRequest("/validate-token", {
        method: "GET",
    });
}

// User profile functions
export async function getUserProfile(): Promise<ApiResponse<User>> {
    return apiRequest("/profile");
}

export async function updateUserProfile(userData: Partial<User>): Promise<ApiResponse> {
    return apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify(userData),
    });
}

export function logout(): Promise<ApiResponse> {
    return apiRequest("/logout", {
        method: "POST",
    });
}
