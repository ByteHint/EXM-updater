"use client";

import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import AuthLayout from "./AuthLayout";
import { useAuthStore } from "@/app/store/useAuthStore"; // Correct import path
import { useShallow } from "zustand/react/shallow"; // 1. Import useShallow to prevent infinite loops

type SignInProps = {
    onSwitchToSignUp: () => void;
    onSwitchToForgot: () => void;
};

export default function SignIn({ onSwitchToSignUp, onSwitchToForgot }: SignInProps) {
    // Local state is only for UI elements specific to this component.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<"google" | "discord" | null>(null);

    // 2. FIX: Use `useShallow` to safely select multiple state properties and actions.
    const { signIn, googleLogin, discordLogin, isLoading, error, clearError } = useAuthStore(
        useShallow((state) => state),
    );

    // The component's job is just to call the action from the store.
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        // 3. FIX: REMOVED the direct IPC call. The component doesn't know about hardwareId.
        // It simply tells the store to "sign in". The store is now responsible for
        // getting the hardware ID itself before making the API call.
        await signIn(email, password);
    };

    // The OAuth handlers are also simplified.
    const handleAuth = async (provider: "google" | "discord") => {
        setOauthLoading(provider);
        clearError();
        await (provider === "google" ? googleLogin() : discordLogin());
        setOauthLoading(null);
    };

    // For a better user experience, clear any old errors when the user starts typing again.
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) clearError();
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) clearError();
        setPassword(e.target.value);
    };

    return (
        <AuthLayout title="Sign In to EXM Tweaks">
            <div className="w-full space-y-[36px] flex flex-col items-center">
                {/* --- OAuth Buttons --- */}
                <div className="flex flex-col gap-[18px] text-white w-full">
                    <Button
                        variant="auth"
                        onClick={() => handleAuth("discord")}
                        disabled={isLoading || !!oauthLoading}
                        className="relative"
                    >
                        {oauthLoading === "discord" ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <img
                                src="res://icons/discord.svg"
                                alt="Discord Logo"
                                className="w-4 h-4 mr-2"
                            />
                        )}
                        Continue with Discord
                    </Button>

                    <Button
                        variant="auth"
                        onClick={() => handleAuth("google")}
                        disabled={isLoading || !!oauthLoading}
                        className="relative"
                    >
                        {oauthLoading === "google" ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <img
                                src="res://icons/google.svg"
                                alt="Google Logo"
                                className="w-4 h-4 mr-2"
                            />
                        )}
                        Continue with Google
                    </Button>
                </div>

                {/* --- Divider --- */}
                <div className="flex items-center text-xs font-normal leading-5 text-gray-600 space-x-4 h-5 justify-around w-full">
                    <div className="flex-1 h-px bg-gray-800" />
                    <span>OR</span>
                    <div className="flex-1 h-px bg-gray-800" />
                </div>

                {/* --- Email/Password Form --- */}
                <form onSubmit={handleSignIn} className="flex flex-col gap-4 w-full">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        className="bg-transparent border border-gray-700 text-white px-3 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                        disabled={isLoading}
                    />

                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="bg-transparent border border-gray-700 text-white px-3 py-2 pr-20 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            disabled={isLoading}
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onSwitchToForgot}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 hover:underline"
                            disabled={isLoading}
                        >
                            Forgot?
                        </button>
                    </div>

                    {error && <div className="text-center text-sm text-red-500">{error}</div>}

                    <Button
                        type="submit"
                        variant="clickauth"
                        disabled={isLoading || !email || !password}
                        className="relative"
                    >
                        {isLoading && !oauthLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Mail className="w-4 h-4 mr-2" />
                        )}
                        {isLoading && !oauthLoading ? "Signing In..." : "Sign In with Email"}
                    </Button>

                    <div className="text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={onSwitchToSignUp}
                            className="text-blue-500 hover:underline focus:outline-none focus:underline"
                            disabled={isLoading}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
