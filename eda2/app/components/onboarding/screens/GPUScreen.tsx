import React, { useState } from "react";

/**
 * GPUScreen is a React functional component that displays a GPU selection screen as part of an onboarding flow.
 *
 * @param props - The component props.
 * @param props.next - A callback function to be called when the user clicks the "Continue" button.
 *
 * @remarks
 * - The component initially detects and selects "NVIDIA" as the default GPU.
 * - Users can switch between "NVIDIA", "AMD", and "intel" by clicking the respective buttons.
 * - The currently selected GPU is visually highlighted.
 * - The "Continue" button triggers the `next` callback passed via props.
 *
 * @example
 * ```tsx
 * <GPUScreen next={() => goToNextStep()} />
 * ```
 */
function GPUScreen(props: { next: React.MouseEventHandler<HTMLButtonElement> | undefined }) {
    const [selectedGPU, setSelectedGPU] = useState("NVIDIA");
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D13] text-white p-8">
            <div className="text-center max-w-md">
                <h2 className="text-3xl font-bold mb-4">We have detected a NVIDIA GPU</h2>
                <p className="text-gray-400 mb-8 text-sm">
                    Please switch below if incorrect, else press "continue".
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => setSelectedGPU("NVIDIA")}
                        className={`p-6 rounded-lg border-2 transition-colors ${
                            selectedGPU === "NVIDIA"
                                ? "border-blue-600 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <div className="text-lg font-bold">NVIDIA</div>
                    </button>

                    <button
                        onClick={() => setSelectedGPU("AMD")}
                        className={`p-6 rounded-lg border-2 transition-colors ${
                            selectedGPU === "AMD"
                                ? "border-blue-600 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <div className="text-lg font-bold">AMD</div>
                    </button>

                    <button
                        onClick={() => setSelectedGPU("intel")}
                        className={`p-6 rounded-lg border-2 transition-colors ${
                            selectedGPU === "intel"
                                ? "border-blue-600 bg-gray-800"
                                : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                    >
                        <div className="text-lg font-bold">intel</div>
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

export default GPUScreen;
