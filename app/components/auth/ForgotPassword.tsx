"use client";

import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import { Button } from "../ui/button";
import OtpStep from "./OptStep";
import PasswordInputWithStrength from "./InputPasswordWithStrength";
import { getPasswordValidationStatus } from "./lib/validation";
import { forgotPassword, verifyOtp, resetPassword } from "../../lib/apiClient";

type ForgotPasswordProps = {
    onSwitchToSignIn: () => void;
    onSwitchToSuccess: () => void;
};

export default function ForgotPassword({ onSwitchToSignIn }: ForgotPasswordProps) {
    const [step, setStep] = useState<"email" | "otp" | "reset">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");

    const allValid = Object.values(getPasswordValidationStatus(password)).every(Boolean);

    const handleSendCode = async () => {
        try {
            const res = await forgotPassword(email);
            if (res.success) {
                setStep("otp");
            } else {
                alert(res.message || "Failed to send reset code");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            alert("Network error. Please make sure the backend is running.");
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const res = await verifyOtp(email, otp);
            if (res.success) {
                setStep("reset");
            } else {
                alert(res.message || "OTP verification failed");
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            alert("Network error. Please make sure the backend is running.");
        }
    };

    const handleResetPassword = async () => {
        try {
            const res = await resetPassword(email, password);
            if (res.success) {
                alert(`Password has been reset for ${email}!`);
                onSwitchToSignIn();
            } else {
                alert(res.message || "Password reset failed");
            }
        } catch (error) {
            console.error("Password reset error:", error);
            alert("Network error. Please make sure the backend is running.");
        }
    };

    return (
        <AuthLayout title="Reset Password">
            {step === "email" && (
                <div className="flex flex-col items-center gap-[24px] w-full mt-8">
                    <p className="text-sm text-gray-400 text-center">
                        Enter your email address and we'll send you a code to reset your password.
                    </p>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border border-gray-700 text-white px-3 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <Button onClick={handleSendCode} className="w-full bg-[#FF2E79]">
                        Reset Password
                    </Button>
                    <button
                        onClick={onSwitchToSignIn}
                        className="text-blue-500 hover:underline text-sm"
                    >
                        Back to Sign In
                    </button>
                </div>
            )}
            {step === "otp" && (
                <>
                    <OtpStep email={email} otp={otp} setOtp={setOtp} onSubmit={handleVerifyOtp} />
                    <button
                        onClick={() => setStep("email")}
                        className="text-blue-500 hover:underline text-sm mt-4"
                    >
                        Back
                    </button>
                </>
            )}
            {step === "reset" && (
                <div className="flex flex-col items-center gap-[32px] w-full">
                    <p className="text-sm text-gray-400 text-center">Enter your new password.</p>
                    <div className="gap-[32px] flex flex-col w-full">
                        <PasswordInputWithStrength password={password} setPassword={setPassword} />
                        <Button
                            className="bg-[#FF2E79]"
                            disabled={!allValid}
                            onClick={handleResetPassword}
                        >
                            Reset Password
                        </Button>
                    </div>
                    <button
                        className="text-[#818CF8] underline text-xs font-normal"
                        onClick={() => setStep("otp")}
                    >
                        Go Back
                    </button>
                </div>
            )}
        </AuthLayout>
    );
}
