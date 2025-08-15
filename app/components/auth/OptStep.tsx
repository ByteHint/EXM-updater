import React, { useState } from "react";
import { Button } from "../ui/button";
import { OtpInput } from "../ui/otp-input";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useShallow } from "zustand/react/shallow";

type OtpStepProps = {
    email: string;
    otp: string;
    setOtp: (otp: string) => void;
    onSubmit: () => void;
    onGoBack?: () => void; // Optional prop for going back to the previous step
};

export default function OtpStep({ email, otp, setOtp, onSubmit, onGoBack }: OtpStepProps) {
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const { resendOtp, error, clearError } = useAuthStore(
        useShallow((state) => ({
            resendOtp: state.resendOtp,
            error: state.error,
            clearError: state.clearError,
        })),
    );

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        setIsResending(true);
        clearError();

        const success = await resendOtp();

        if (success) {
            // Start cooldown timer
            setResendCooldown(60);
            const timer = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        setIsResending(false);
    };

    const handleSubmit = () => {
        clearError();
        onSubmit();
    };

    return (
        <div className="flex flex-col gap-[24px] items-center w-full">
            <div className="gap-[24px] flex flex-col items-center">
                <div className="text-center font-normal text-sm text-gray-400 mt-[30px]">
                    We have sent a code to{" "}
                    <span className="font-semibold text-sm text-white">{email}</span>
                </div>
            </div>
            <div className="flex flex-col gap-[12px] justify-center items-center">
                <div className="flex flex-row gap-[12px] items-center fit-content">
                    <OtpInput value={otp} onChange={(val) => setOtp(val)} length={4} />
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={otp.length !== 4}
                    className="bg-[#FF2E79] py-[10px] px-[36px] font-medium"
                >
                    Continue
                </Button>
            </div>

            {/* Error message */}
            {error && <div className="text-red-500 text-sm text-center max-w-xs">{error}</div>}

            {/* Resend OTP section */}
            <div className="flex flex-col gap-2 items-center">
                <button
                    onClick={handleResendOtp}
                    disabled={isResending || resendCooldown > 0}
                    className="text-[#818CF8] text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isResending
                        ? "Sending..."
                        : resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : "Didn't receive the email? Click to resend"}
                </button>

                {onGoBack && (
                    <button
                        onClick={onGoBack}
                        className="text-gray-500 text-sm hover:text-gray-400"
                    >
                        ← Back to signup
                    </button>
                )}
            </div>
        </div>
    );
}
