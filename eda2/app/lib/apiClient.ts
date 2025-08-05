// Modern API client with TypeScript support
const API_URL =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
    "http://localhost:5000/api/v1";

// Types
interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    token?: string;
    user?: any;
    authUrl?: string;
    error?: string;
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
        }

        const config: RequestInit = {
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

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
    hardwareId: string,
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

export async function signIn(
    email: string,
    password: string,
    hardwareId: string,
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
export async function getGoogleAuthUrl(): Promise<ApiResponse> {
    return apiRequest("/auth/google", {
        method: "GET",
    });
}

export async function getDiscordAuthUrl(): Promise<ApiResponse> {
    return apiRequest("/auth/discord");
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

// Token validation
export async function validateToken(): Promise<ApiResponse> {
    return apiRequest("/validate-token", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
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
