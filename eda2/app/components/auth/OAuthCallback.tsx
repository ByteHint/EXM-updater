"use client";

import React, { useEffect, useState } from "react";
import { handleOAuthCallback } from "../../lib/apiClient";

type OAuthCallbackProps = {
    provider: "google" | "discord";
    onSuccess?: (token: string, user: any) => void;
    onError?: (error: string) => void;
};

export default function OAuthCallback({ provider, onSuccess, onError }: OAuthCallbackProps) {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Processing authentication...");

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Get the authorization code from URL params
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get("code");
                const state = urlParams.get("state");
                const error = urlParams.get("error");

                if (error) {
                    setStatus("error");
                    setMessage(`Authentication failed: ${error}`);
                    onError?.(error);
                    return;
                }

                if (!code) {
                    setStatus("error");
                    setMessage("No authorization code received");
                    onError?.("No authorization code received");
                    return;
                }

                // Process the OAuth callback
                const result = await handleOAuthCallback(provider, code, state || undefined);

                if (result.success && result.token) {
                    // Store the token
                    localStorage.setItem("auth_token", result.token);

                    setStatus("success");
                    setMessage("Authentication successful! Redirecting...");

                    // Call success callback
                    onSuccess?.(result.token, result.user);

                    // Close popup if in popup window
                    if (window.opener) {
                        window.opener.postMessage(
                            {
                                type: "oauth_success",
                                provider,
                                token: result.token,
                                user: result.user,
                            },
                            "*",
                        );
                        window.close();
                    } else {
                        // Redirect to main app if not in popup
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 2000);
                    }
                } else {
                    setStatus("error");
                    setMessage(result.message || "Authentication failed");
                    onError?.(result.message || "Authentication failed");
                }
            } catch (error) {
                console.error("OAuth callback error:", error);
                setStatus("error");
                setMessage("An unexpected error occurred");
                onError?.("An unexpected error occurred");
            }
        };

        processCallback();
    }, [provider, onSuccess, onError]);

    const getProviderName = () => {
        return provider.charAt(0).toUpperCase() + provider.slice(1);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
                <div className="mb-6">
                    {status === "loading" && (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    )}
                    {status === "success" && (
                        <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <svg
                                className="h-6 w-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="h-12 w-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                            <svg
                                className="h-6 w-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                <h2 className="text-xl font-semibold text-white mb-4">
                    {getProviderName()} Authentication
                </h2>

                <p className="text-gray-300 mb-6">{message}</p>

                {status === "error" && (
                    <button
                        onClick={() => window.close()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Close Window
                    </button>
                )}
            </div>
        </div>
    );
}
