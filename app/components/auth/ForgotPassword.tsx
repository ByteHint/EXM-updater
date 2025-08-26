"use client";

import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import { Button } from "../ui/button";
import OtpStep from "./OptStep";
import PasswordInputWithStrength from "./InputPasswordWithStrength";
import { getPasswordValidationStatus } from "./lib/validation";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useShallow } from "zustand/react/shallow";

type ForgotPasswordProps = {
    onSwitchToSignIn: () => void;
    onSwitchToSuccess: () => void;
};

export default function ForgotPassword({ onSwitchToSignIn }: ForgotPasswordProps) {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");

    const {
        forgotPassword,
        verifyOtp,
        resetPassword,
        isLoading,
        error,
        clearError,
        authFlowStatus,
        resetAuthFlow,
        flowEmail,
    } = useAuthStore(useShallow((state) => state));

    const allValid = Object.values(getPasswordValidationStatus(password)).every(Boolean);

    // Keep current auth flow to avoid flicker between layout and OTP

    const handleSendCode = async () => {
        clearError();
        await forgotPassword(email);
    };

    const handleVerifyOtp = async () => {
        clearError();
        await verifyOtp(otp);
    };

    const handleResetPassword = async () => {
        clearError();
        const success = await resetPassword(password);
        if (success) {
            // User is now authenticated; router will redirect to /dashboard
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) clearError();
        setEmail(e.target.value);
    };

    const handleGoBack = () => {
        clearError();
        resetAuthFlow();
    };

    // Determine current step based on authFlowStatus
    const getCurrentStep = () => {
        if (authFlowStatus === "awaiting-otp") return "otp";
        if (authFlowStatus === "awaiting-password-reset") return "reset";
        return "email";
    };

    const currentStep = getCurrentStep();

    return (
        <AuthLayout title="Reset Password">
            {currentStep === "email" && (
                <div className="flex flex-col items-center gap-[24px] w-full mt-8">
                    <p className="text-sm text-gray-400 text-center">
                        Enter your email address and we'll send you a code to reset your password.
                    </p>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        className="bg-transparent border border-gray-700 text-white px-3 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                        disabled={isLoading}
                    />
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <Button
                        onClick={handleSendCode}
                        className="w-full bg-[#FF2E79]"
                        disabled={isLoading || !email}
                    >
                        {isLoading ? "Sending..." : "Reset Password"}
                    </Button>
                    <button
                        onClick={onSwitchToSignIn}
                        className="text-blue-500 hover:underline text-sm"
                        disabled={isLoading}
                    >
                        Back to Sign In
                    </button>
                </div>
            )}
            {currentStep === "otp" && (
                <>
                    <OtpStep
                        email={flowEmail || email}
                        otp={otp}
                        setOtp={setOtp}
                        onSubmit={handleVerifyOtp}
                        onGoBack={handleGoBack}
                    />
                </>
            )}
            {currentStep === "reset" && (
                <div className="flex flex-col items-center gap-[32px] w-full">
                    <p className="text-sm text-gray-400 text-center">Enter your new password.</p>
                    <div className="gap-[32px] flex flex-col w-full">
                        <PasswordInputWithStrength
                            password={password}
                            setPassword={setPassword}
                            _isDisabled={isLoading}
                        />
                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                        <Button
                            className="bg-[#FF2E79]"
                            disabled={!allValid || isLoading}
                            onClick={handleResetPassword}
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
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
