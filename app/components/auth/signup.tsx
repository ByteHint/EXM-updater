"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Mail, Loader2 } from "lucide-react";
import { emailSchema, getPasswordValidationStatus, passwordSchema } from "./lib/validation";
import AuthLayout from "./AuthLayout";
import PasswordInputWithStrength from "./InputPasswordWithStrength";
import OtpStep from "./OptStep";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useShallow } from "zustand/react/shallow"; // Import useShallow to fix the hook

type SignUpProps = {
    onSwitchToSignIn: () => void;
};

export default function SignUp({ onSwitchToSignIn }: SignUpProps) {
    // Local state is only for UI control within this component.
    const [uiStep, setUiStep] = useState<"providers" | "email">("providers");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [oauthLoading, setOauthLoading] = useState<"google" | "discord" | null>(null);

    // 1. FIX: Use `useShallow` to prevent infinite loops when selecting multiple properties.
    const {
        signUp,
        verifyOtp,
        googleLogin,
        discordLogin,
        isLoading,
        error,
        clearError,
        authFlowStatus,
        resetAuthFlow,
        flowEmail,
    } = useAuthStore(useShallow((state) => state));

    // --- Action Handlers ---
    // The component's only job is to call actions from the store.

    const handleAuth = async (provider: "google" | "discord") => {
        setOauthLoading(provider);
        clearError();
        await (provider === "google" ? googleLogin() : discordLogin());
        setOauthLoading(null);
    };

    const handlePasswordSubmit = async () => {
        const result = passwordSchema.safeParse(password);
        if (!result.success) return;

        // 2. FIX: The component NO LONGER gets the hardware ID.
        // It simply tells the store to "sign up". The store is responsible
        // for getting the hardware ID via IPC before calling the API.
        await signUp(email, password);
    };

    const handleOtpSubmit = async () => {
        await verifyOtp(otp);
    };

    // --- UI Control Handlers ---

    const handleEmailContinue = () => {
        const result = emailSchema.safeParse(email);
        if (!result.success) {
            setEmailError(result.error.issues[0].message);
        } else {
            setEmailError("");
            setUiStep("email");
        }
    };

    const handleGoBack = () => {
        resetAuthFlow();
        setUiStep("providers");
        setPassword("");
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) clearError();
        setEmailError("");
        setEmail(e.target.value);
    };

    // Reset the local UI if the global flow state changes (e.g., after successful login)
    useEffect(() => {
        if (authFlowStatus === "idle") {
            setUiStep("providers");
        }
    }, [authFlowStatus]);

    const isPasswordValid = Object.values(getPasswordValidationStatus(password)).every(Boolean);

    // The main rendering logic now checks the global authFlowStatus first.
    if (authFlowStatus === "awaiting-otp") {
        return (
            <AuthLayout title="Check your email">
                <OtpStep
                    email={flowEmail || email}
                    otp={otp}
                    setOtp={setOtp}
                    onSubmit={handleOtpSubmit}
                    onGoBack={handleGoBack}
                />
            </AuthLayout>
        );
    }

    // --- JSX (No major changes needed, just wiring up the corrected handlers) ---

    return (
        <AuthLayout title="Get Started with EXM Tweaks">
            {uiStep === "providers" && (
                <div className="w-full space-y-[36px] flex flex-col items-center">
                    <div className="flex flex-col gap-[18px] text-white w-full">
                        <Button
                            variant="auth"
                            onClick={() => handleAuth("discord")}
                            disabled={isLoading || !!oauthLoading}
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
                    <div className="flex items-center text-xs font-normal leading-5 text-gray-600 space-x-4 h-5 justify-around w-full">
                        <div className="flex-1 h-px bg-gray-800" />
                        <span>OR</span>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={isLoading}
                                className="bg-transparent border border-gray-700 text-white px-3 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                            {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                            <Button
                                onClick={handleEmailContinue}
                                variant="clickauth"
                                disabled={isLoading || !email}
                            >
                                <Mail /> Sign up with email
                            </Button>
                        </div>
                        {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
                        <div className="flex justify-center gap-2 text-center text-sm">
                            Already have an account?{" "}
                            <button
                                onClick={onSwitchToSignIn}
                                className="text-blue-500 hover:underline"
                                disabled={isLoading}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {uiStep === "email" && (
                <div className="flex flex-col items-center gap-[32px] w-full">
                    <div className="gap-[32px] flex flex-col w-full">
                        <div className="gap-[16px] flex flex-col w-full">
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="border rounded-[10px] bg-[#282832] border-gray-700 text-white px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 h-[40px] text-xs font-normal"
                            />
                            <PasswordInputWithStrength
                                password={password}
                                setPassword={setPassword}
                                isDisabled={isLoading}
                            />
                        </div>
                        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                        <Button
                            className="bg-[#FF2E79]"
                            disabled={!isPasswordValid || isLoading}
                            onClick={handlePasswordSubmit}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <Mail />} Create
                            Account
                        </Button>
                    </div>
                    <button
                        className="text-[#818CF8] underline text-xs font-normal"
                        onClick={handleGoBack}
                        disabled={isLoading}
                    >
                        Go Back
                    </button>
                </div>
            )}
        </AuthLayout>
    );
}
