import React, { useState } from "react";
import { Rocket, Zap, Shield, Monitor } from "lucide-react";

/**
 * Renders the onboarding screen for selecting an optimization preference.
 *
 * This component displays a set of optimization options (High performance, Low latency,
 * Performance and Latency, Everyday use) as selectable buttons. The user can select one
 * option, which is visually highlighted. Upon selection, the chosen optimization is stored
 * in the component's state. The "Continue" button triggers the `next` callback passed via props.
 *
 * @param props - The component props.
 * @param props.next - A callback function invoked when the user clicks the "Continue" button.
 *
 * @returns The onboarding optimization selection screen as a React element.
 */
function OptimizationScreen(props) {
    const [selectedOptimization, setSelectedOptimization] = useState("Low latency");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D13] text-white p-8">
            <div className="text-center max-w-lg">
                <h2 className="text-3xl font-bold mb-4">What do you want to optimize for?</h2>
                <p className="text-gray-400 mb-8 text-sm">Select your preferred use case below.</p>

                <div className="space-y-4 mb-8">
                    <button
                        onClick={() => setSelectedOptimization("High performance")}
                        className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${
                            selectedOptimization === "High performance"
                                ? "border-blue-600 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <Rocket className="w-5 h-5" />
                        <span>High performance</span>
                    </button>

                    <button
                        onClick={() => setSelectedOptimization("Low latency")}
                        className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${
                            selectedOptimization === "Low latency"
                                ? "border-blue-600 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <Zap className="w-5 h-5" />
                        <span>Low latency</span>
                    </button>

                    <button
                        onClick={() => setSelectedOptimization("Performance and Latency")}
                        className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${
                            selectedOptimization === "Performance and Latency"
                                ? "border-blue-600 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <Shield className="w-5 h-5" />
                        <span>Performance and Latency</span>
                    </button>

                    <button
                        onClick={() => setSelectedOptimization("Everyday use")}
                        className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${
                            selectedOptimization === "Everyday use"
                                ? "border-blue-600 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <Monitor className="w-5 h-5" />
                        <span>Everyday use</span>
                    </button>
                </div>

                <button
                    onClick={props.next}
                    className="bg-pink-700 hover:bg-pink-800 text-black px-8 py-3 rounded-lg font-medium transition-colors w-full"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default OptimizationScreen;
