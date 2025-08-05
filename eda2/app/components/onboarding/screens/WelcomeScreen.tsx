import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * WelcomeScreen component displays a welcome message and a button to proceed to the next onboarding step.
 * @param next - Handler for the "Get started" button click event.
 */
const WelcomeScreen = ({
    next,
}: {
    next: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D13] text-white p-8">
        <div className="text-center max-w-md">
            <div className="flex flex-col items-center mb-4">
                <img src="res://icons/logo.png" alt="EXM Tweaks Logo" className="w-16 h-8 mb-4" />
                <h1 className="text-3xl font-bold text-center">Welcome to EXM Tweaks</h1>
            </div>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                EXM Tweaks is your go to Windows tweaker, helping you{" "}
                <span className="text-white font-medium">reduce stutters</span>,{" "}
                <span className="text-white font-medium">improve performance</span> and{" "}
                <span className="text-white font-medium">decrease latency</span>.
            </p>

            <button
                onClick={next}
                className="bg-pink-700 hover:bg-pink-800 text-white px-14 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
                Get started <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default WelcomeScreen;
