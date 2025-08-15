"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
    const navigate = useNavigate();
    const {
        setUser,
        setIsAuthenticated,
        setError,
        setLoading,
        handleOAuthCallback,
        validateSession,
    } = useAuthStore();
    const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
    const [message, setMessage] = useState("Processing authentication...");

    useEffect(() => {
        const handleCallback = () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const dataString = urlParams.get("data");

                if (dataString) {
                    const authData = JSON.parse(decodeURIComponent(dataString));
                    console.warn("[OAUTH CALLBACK] Received auth data:", authData);

                    if (authData.success && authData.token && authData.user) {
                        // Store the token
                        localStorage.setItem("auth_token", authData.token);

                        // Try to communicate with desktop app in multiple ways
                        const authDataString = encodeURIComponent(JSON.stringify(authData));

                        // Method 1: Try to send message to parent window (if opened from desktop)
                        if (window.opener) {
                            try {
                                window.opener.postMessage(
                                    {
                                        type: "OAUTH_SUCCESS",
                                        data: authData,
                                    },
                                    "*",
                                );
                                console.warn("[OAUTH CALLBACK] Sent message to parent window");
                            } catch (e) {
                                console.warn(
                                    "[OAUTH CALLBACK] Could not send message to parent window:",
                                    e,
                                );
                            }
                        }

                        // Method 2: Try to communicate with desktop app via window.api
                        if (typeof window !== "undefined" && window.api) {
                            try {
                                window.api.invoke("oauth-callback", authDataString);
                                console.warn(
                                    "[OAUTH CALLBACK] Sent data to desktop app via window.api",
                                );
                            } catch (e) {
                                console.warn(
                                    "[OAUTH CALLBACK] Could not send data via window.api:",
                                    e,
                                );
                            }
                        }

                        // Method 3: Try custom protocol (fallback) with user gesture
                        const openDesktop = () => {
                            try {
                                const protocolUrl = `exmapp://auth/callback?data=${authDataString}`;
                                window.location.href = protocolUrl;
                                console.warn("[OAUTH CALLBACK] Attempted custom protocol redirect");
                            } catch (e) {
                                console.warn("[OAUTH CALLBACK] Custom protocol failed:", e);
                            }
                        };

                        // Method 4: Update auth state directly (for web mode)
                        handleOAuthCallback(authDataString);

                        // Method 5: Trigger session validation
                        setTimeout(() => {
                            validateSession();
                        }, 1000);

                        setStatus("success");
                        setMessage(
                            `Authentication successful! Welcome, ${authData.user.name || authData.user.email}!`,
                        );

                        console.warn(
                            "[OAUTH CALLBACK] Authentication successful for user:",
                            authData.user.email,
                        );

                        // Offer a button to trigger user-gesture for custom protocol if needed
                        setTimeout(() => {
                            const btn = document.createElement("button");
                            btn.innerText = "Return to Desktop App";
                            btn.style.padding = "8px 12px";
                            btn.style.marginTop = "12px";
                            btn.onclick = () => openDesktop();
                            document.body.appendChild(btn);
                        }, 500);
                    } else {
                        // Handle error
                        setStatus("error");
                        setMessage(authData.message || "OAuth authentication failed");
                        setError(authData.message || "OAuth authentication failed");
                        setLoading(false);

                        console.error("[OAUTH CALLBACK] Authentication failed:", authData.message);

                        // Close the browser window/tab on error too
                        setTimeout(() => {
                            if (window.opener) {
                                window.close();
                            } else {
                                navigate("/welcome", { replace: true });
                            }
                        }, 5000);
                    }
                } else {
                    setStatus("error");
                    setMessage("No authentication data received");
                    setError("No authentication data received");
                    setLoading(false);

                    console.error("[OAUTH CALLBACK] No data parameter found");

                    // Close the browser window/tab
                    setTimeout(() => {
                        if (window.opener) {
                            window.close();
                        } else {
                            navigate("/welcome", { replace: true });
                        }
                    }, 5000);
                }
            } catch (error) {
                console.error("Error processing OAuth callback:", error);
                setStatus("error");
                setMessage("Failed to process authentication callback");
                setError("Failed to process authentication callback");
                setLoading(false);

                // Close the browser window/tab
                setTimeout(() => {
                    if (window.opener) {
                        window.close();
                    } else {
                        navigate("/welcome", { replace: true });
                    }
                }, 5000);
            }
        };

        handleCallback();
    }, [
        navigate,
        setUser,
        setIsAuthenticated,
        setError,
        setLoading,
        handleOAuthCallback,
        validateSession,
    ]);

    const getStatusIcon = () => {
        switch (status) {
            case "processing":
                return (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                );
            case "success":
                return <div className="text-green-400 text-4xl mb-4">✅</div>;
            case "error":
                return <div className="text-red-400 text-4xl mb-4">❌</div>;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case "processing":
                return "text-white";
            case "success":
                return "text-green-400";
            case "error":
                return "text-red-400";
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
            <div className="flex flex-col items-center text-center max-w-md px-6">
                {getStatusIcon()}
                <div className={`text-xl font-semibold mb-2 ${getStatusColor()}`}>
                    {status === "processing" && "Processing Authentication..."}
                    {status === "success" && "Authentication Successful!"}
                    {status === "error" && "Authentication Failed"}
                </div>
                <div className="text-gray-400 text-sm mb-4">{message}</div>
                {status === "success" && (
                    <div className="text-gray-500 text-xs">
                        This window will close automatically and return you to the desktop app.
                        <br />
                        If the desktop app doesn't update, please refresh it manually.
                    </div>
                )}
                {status === "error" && (
                    <div className="text-gray-500 text-xs">
                        This window will close automatically. You can try logging in again.
                    </div>
                )}
                {status === "processing" && (
                    <div className="text-gray-500 text-xs">
                        Please wait while we process your authentication...
                    </div>
                )}
            </div>
        </div>
    );
}
