import React, { useState } from "react";

/**
 * CPUScreen is a React functional component that renders a CPU selection screen for onboarding.
 *
 * @remarks
 * This component displays a message indicating that an Intel CPU has been detected and allows the user to switch
 * between "AMD" and "intel" CPU options. The selected CPU is visually highlighted. The user can confirm their selection
 * by pressing the "Continue" button, which triggers the `next` callback passed via props.
 *
 * @param props - The component props.
 * @param props.next - A callback function to be called when the user clicks the "Continue" button.
 *
 * @returns A JSX element representing the CPU selection screen.
 */
function CPUScreen(props: { next: React.MouseEventHandler<HTMLButtonElement> | undefined }) {
    const [selectedCPU, setSelectedCPU] = useState("intel");
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D13] text-white p-8">
            <div className="text-center max-w-md">
                <h2 className="text-3xl font-bold mb-4">We have detected an Intel CPU</h2>
                <p className="text-gray-400 mb-8 text-sm">
                    Please switch below if incorrect, else press "continue".
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setSelectedCPU("AMD")}
                        className={`p-8 rounded-lg border-2 transition-colors ${
                            selectedCPU === "AMD"
                                ? "border-blue-600 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <div className="text-2xl font-bold mb-2">AMD</div>
                    </button>

                    <button
                        onClick={() => setSelectedCPU("intel")}
                        className={`p-8 rounded-lg border-2 transition-colors ${
                            selectedCPU === "intel"
                                ? "border-blue-600 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <div className="text-2xl font-bold mb-2">intel</div>
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

export default CPUScreen;
