import React, { useState } from "react";

/**
 * ThemeScreen component allows users to select a visual theme during onboarding.
 *
 * @component
 * @param props - Component props.
 * @param props.next - Callback function to proceed to the next onboarding step.
 *
 * @returns A themed selection screen with custom and standard theme options.
 *
 * @remarks
 * - Users can choose between three custom themes ("EXM", "Lecctron", "Khorvie") and two standard themes ("Dark", "Light").
 * - The currently selected theme is visually highlighted.
 * - The "Continue" button triggers the `next` callback provided via props.
 *
 * @example
 * ```tsx
 * <ThemeScreen next={() => goToNextStep()} />
 * ```
 */

const ThemeScreen = (props) => {
    const [selectedTheme, setSelectedTheme] = useState("EXM");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D13] text-white p-8">
            <div className="text-center max-w-md">
                <h2 className="text-3xl font-bold mb-4">Choose a theme</h2>
                <p className="text-gray-400 mb-8 text-sm">
                    Choose between light and dark mode or use a custom theme.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {/* Custom Themes */}
                    <button
                        onClick={() => setSelectedTheme("EXM")}
                        className={`flex justify-center items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                            selectedTheme === "EXM"
                                ? "border-pink-500 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <div className="w-4 h-4 bg-pink-500 rounded"></div>
                        <span className="text-sm">EXM</span>
                    </button>

                    <button
                        onClick={() => setSelectedTheme("Lecctron")}
                        className={`flex justify-center items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                            selectedTheme === "Lecctron"
                                ? "border-red-500 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-sm">Lecctron</span>
                    </button>

                    <button
                        onClick={() => setSelectedTheme("Khorvie")}
                        className={`flex justify-center items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                            selectedTheme === "Khorvie"
                                ? "border-blue-500 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm">Khorvie</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    {/* Standard Themes */}
                    <button
                        onClick={() => setSelectedTheme("Dark")}
                        className={`flex justify-center items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                            selectedTheme === "Dark"
                                ? "border-gray-600 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <div className="w-4 h-4 bg-gray-600 rounded"></div>
                        <span className="text-sm">Dark</span>
                    </button>

                    <button
                        onClick={() => setSelectedTheme("Light")}
                        className={`flex justify-center items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                            selectedTheme === "Light"
                                ? "border-gray-300 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span className="text-sm">Light</span>
                    </button>
                </div>

                <button
                    //  Use this whenever Selected Theme needed onClick={() => props.next(selectedTheme)}
                    onClick={props.next}
                    className="bg-pink-500 hover:bg-pink-600 text-black px-8 py-3 rounded-lg font-medium transition-colors w-full"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default ThemeScreen;
