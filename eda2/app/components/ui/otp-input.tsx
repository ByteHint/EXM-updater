"use client";

import React, { useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    className?: string;
    disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
    value,
    onChange,
    length = 4,
    className,
    disabled = false,
}) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
        if (disabled) return;

        const targetValue = e.target.value;
        const sanitizedValue = targetValue.replace(/[^0-9]/g, "").slice(0, 1);

        const otpArray = value.split("");
        otpArray[index] = sanitizedValue;
        const newOtpValue = otpArray.join("");
        onChange(newOtpValue);

        if (sanitizedValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
        if (disabled) return;

        if (e.key === "Backspace") {
            e.preventDefault();

            const otpArray = value.split("");

            if (otpArray[index]) {
                otpArray[index] = "";
                onChange(otpArray.join(""));
            } else if (index > 0) {
                otpArray[index - 1] = "";
                onChange(otpArray.join(""));
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            e.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
        if (disabled) return;
        e.preventDefault();

        const pastedData = e.clipboardData
            .getData("text/plain")
            .replace(/[^0-9]/g, "")
            .slice(0, length);

        onChange(pastedData);

        const nextFocusIndex = Math.min(pastedData.length, length - 1);
        setTimeout(() => {
            inputRefs.current[nextFocusIndex]?.focus();
        }, 0);
    };

    return (
        <div className={cn("flex justify-center gap-[12px]", className)}>
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el!;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ""}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={cn(
                        "h-[76px] w-[76px] flex-1 rounded-md text-center text-2xl font-semibold",
                        "border border-input bg-[#1A1A24] ring-offset-background",
                        "transition-all duration-300",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        "placeholder:text-muted-foreground",
                        disabled && "opacity-50 cursor-not-allowed",
                    )}
                    aria-label={`OTP digit ${index + 1}`}
                />
            ))}
        </div>
    );
};
