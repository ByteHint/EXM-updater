"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldUser, Star, Users } from "lucide-react";
import { useState, useEffect } from "react";
import ForgotPassword from "../auth/ForgotPassword";
import "./styles.css";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import { useAuthStore } from "@/app/store/useAuthStore";

type AuthFlow = "signup" | "signin" | "forgot";

export default function Welcome() {
    const authFlowStatus = useAuthStore((state) => state.authFlowStatus);
    // Initialize from global flow to avoid resetting back to signup during OTP/reset flows
    const [authFlow, setAuthFlow] = useState<AuthFlow>(() =>
        authFlowStatus === "awaiting-otp" || authFlowStatus === "awaiting-password-reset"
            ? "forgot"
            : "signup",
    );

    // Keep the view in sync with the multi-step status
    useEffect(() => {
        if (authFlowStatus === "awaiting-otp" || authFlowStatus === "awaiting-password-reset") {
            setAuthFlow("forgot");
        }
    }, [authFlowStatus]);

    const handleSwitchToSignIn = () => setAuthFlow("signin");
    const handleSwitchToSignUp = () => setAuthFlow("signup");
    const handleSwitchToForgot = () => setAuthFlow("forgot");
    const handleSwitchToSuccess = () => setAuthFlow("signin");

    const renderAuthComponent = () => {
        switch (authFlow) {
            case "signin":
                return (
                    <SignIn
                        onSwitchToSignUp={handleSwitchToSignUp}
                        onSwitchToForgot={handleSwitchToForgot}
                    />
                );
            case "forgot":
                return (
                    <ForgotPassword
                        onSwitchToSignIn={handleSwitchToSignIn}
                        onSwitchToSuccess={handleSwitchToSuccess}
                    />
                );
            case "signup":
                return <SignUp onSwitchToSignIn={handleSwitchToSignIn} />;
            default:
                return <SignUp onSwitchToSignIn={handleSwitchToSignIn} />;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-2 h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={authFlow}
                        className="w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        {renderAuthComponent()}
                    </motion.div>
                </AnimatePresence>

                <div className="bg-[#14141E]">
                    <div className="flex flex-col gap-[36px] overflow-hidden">
                        <img
                            src="res://icons/sidebar.png"
                            className="min-w-[987.2px] h-[617px] pl-[48px] pt-[48px] overflow-clip"
                            alt="Sidebar Graphic"
                        />
                        <div className="flex flex-row justify-center gap-[60px] max-h-[36px]">
                            <div className="flex items-center gap-[12px]">
                                <ShieldUser color="#FF2E79" size={32} />
                                <div className="flex flex-col gap-[1px]">
                                    <div className="flex gap-[2px]">
                                        {[...Array(5)].map((_, index) => (
                                            <Star
                                                key={index}
                                                strokeWidth={1.5}
                                                color="#FF2E79"
                                                fill="#FF2E79"
                                                size={12}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-xs font-normal text-[#FF2E79] text-center leading-5">
                                        4.8 out of 5
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-[12px]">
                                <Users color="#818CF8" size={32} />
                                <div className="flex flex-col tracking-normal">
                                    <div className="text-sm font-medium text-[#818CF8] leading-5">
                                        400 000+
                                    </div>
                                    <div className="text-xs font-normal text-[#818CF8] text-center leading-5 -mt-1">
                                        Satisfied Users
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
