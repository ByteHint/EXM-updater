import React from "react";
import { ChevronRight } from "lucide-react";
import { useAppStore } from "@/app/store/useAuthStore";

const actions = [
    { label: "Check out the dashboard", screen: "dashboard" },
    { label: "Tweak my system", screen: "tweak" },
    { label: "Remove useless bloat", screen: "bloat" },
    { label: "Optimize my network settings", screen: "network" },
];

/**
 * Renders the onboarding actions screen, allowing users to select their first optimization step.
 *
 * This component displays a list of actionable buttons for users to choose what they want to do first
 * after onboarding. Each button represents a different optimization or action, such as checking the dashboard,
 * tweaking the system, removing bloat, or optimizing network settings.
 *
 * @component
 * @returns {JSX.Element} The rendered onboarding actions screen.
 */
export default function ActionsScreen() {
    const setOnboarded = useAppStore((state) => state.setOnboarded);
    const setCurrentScreen = useAppStore((state) => state.setCurrentScreen);

    const handleAction = (screen: string) => {
        setOnboarded(true);
        setCurrentScreen(screen);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D13] text-white p-8">
            <div className="text-center max-w-md">
                <h2 className="text-3xl font-bold mb-4">Awesome! What do you want to do first?</h2>
                <p className="text-gray-400 mb-8 text-sm">
                    You can unselect any of the optimizations below if you wish.
                </p>

                <div className="space-y-4 mb-8">
                    {actions.map(({ label, screen }) => (
                        <button
                            key={screen}
                            onClick={() => handleAction(screen)}
                            className="w-full p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-between"
                        >
                            <span>{label}</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
