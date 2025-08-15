// components/auth/lib/validation.ts

import { z } from "zod";

export type PasswordStrength = "Very Weak" | "Weak" | "Moderate" | "Strong" | "Very Strong";

export const emailSchema = z.string().email({ message: "Invalid email address" });

export const passwordSchema = z
    .string()
    .min(8, { message: "At least 8 characters" })
    .max(64, { message: "Max 64 characters" })
    .refine((val) => /[A-Z]/.test(val), { message: "Must include an uppercase letter" })
    .refine((val) => /[a-z]/.test(val), { message: "Must include a lowercase letter" })
    .refine((val) => /[0-9]/.test(val), { message: "Must include a number" })
    .refine((val) => /[^A-Za-z0-9]/.test(val), { message: "Must include a special character" });

export const getPasswordValidationStatus = (password: string) => ({
    length: password.length >= 8 && password.length <= 64,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
});

export const getPasswordStrength = (
    password: string,
): { label: PasswordStrength; color: string } => {
    const status = getPasswordValidationStatus(password);
    const passed = Object.values(status).filter(Boolean).length;

    if (passed <= 1) return { label: "Very Weak", color: "text-red-500" };
    if (passed === 2) return { label: "Weak", color: "text-orange-500" };
    if (passed === 3) return { label: "Moderate", color: "text-yellow-500" };
    if (passed === 4) return { label: "Strong", color: "text-green-500" };
    return { label: "Very Strong", color: "text-blue-500" };
};
