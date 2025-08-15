import React from "react";
import { getPasswordStrength, getPasswordValidationStatus } from "./lib/validation";

type PasswordInputProps = {
    password: string;
    setPassword: (password: string) => void;
    isDisabled?: boolean; // Optional prop to disable the input
};

export default function PasswordInputWithStrength({
    password,
    setPassword,
    isDisabled,
}: PasswordInputProps) {
    const status = getPasswordValidationStatus(password);
    const strength = getPasswordStrength(password);
    const passedRules = Object.values(status).filter(Boolean).length;

    return (
        <div className="gap-[16px] flex flex-col w-full">
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-[10px] border-gray-700 text-white px-3 py-2 bg-[#282832] w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            {password && (
                <div className="text-xs space-y-1">
                    <div className="flex justify-between items-center">
                        <div className={`font-semibold ${strength.color}`}>{strength.label}</div>
                        <div className="flex gap-[4px] w-1/4">
                            {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-[3px] flex-1 rounded-md transition-colors duration-300 ${i < passedRules ? "bg-green-500" : "bg-gray-700"}`}
                                    />
                                ))}
                        </div>
                    </div>
                    <p className={status.uppercase ? "text-green-500" : "text-red-500"}>
                        · At least one uppercase letter
                    </p>
                    <p className={status.lowercase ? "text-green-500" : "text-red-500"}>
                        · At least one lowercase letter
                    </p>
                    <p className={status.number ? "text-green-500" : "text-red-500"}>
                        · At least one number
                    </p>
                    <p className={status.special ? "text-green-500" : "text-red-500"}>
                        · At least one special character
                    </p>
                    <p className={status.length ? "text-green-500" : "text-red-500"}>
                        · Between 8 and 64 characters
                    </p>
                </div>
            )}
        </div>
    );
}
