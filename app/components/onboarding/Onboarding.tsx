import { useState } from "react";
import ActionsScreen from "./screens/ActionsScreen";
import CPUScreen from "./screens/CPUScreen";
import GPUScreen from "./screens/GPUScreen";
import OptimizationScreen from "./screens/OptimizationScreen";
import ThemeScreen from "./screens/ThemeScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

/**
 * OnboardingFlow is a React component that manages a multi-step onboarding process.
 *
 * @component
 *
 * @remarks
 * - Handles navigation between onboarding steps using internal state.
 * - Displays a progress indicator and a back button for user navigation.
 * - Renders different onboarding screens based on the current step.
 *
 * @returns {JSX.Element} The rendered onboarding flow UI.
 *
 * @example
 * ```tsx
 * <OnboardingFlow />
 * ```
 *
 * @internal
 *
 * @description
 * The component maintains the current step in the onboarding process using `useState`.
 * It provides `nextStep` and `prevStep` functions to navigate between steps, and conditionally
 * renders a back button and a progress indicator. The onboarding screens are defined in the
 * `screens` array and rendered according to the current step.
 */
const OnboardingFlow = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const totalSteps = 6;

    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Progress Indicator
    const ProgressIndicator = () => (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${index === currentStep ? "bg-pink-500" : "bg-gray-600"}`}
                />
            ))}
        </div>
    );

    // Back Button (only show after first screen)
    const BackButton = () =>
        currentStep > 0 && (
            <button
                onClick={prevStep}
                className="fixed top-8 left-8 text-gray-400 hover:text-white transition-colors"
            >
                ← Back
            </button>
        );

    /**
     * An array of functions, each returning a React component representing a step in the onboarding flow.
     *
     * - Each function returns a JSX element for a specific onboarding screen.
     * - The `next` prop is passed to all screens except the final `ActionsScreen`, which does not require it.
     *
     * @remarks
     * This array is used to manage the sequence and rendering of onboarding steps.
     */
    const screens = [
        () => <WelcomeScreen next={nextStep} />,
        () => <ThemeScreen next={nextStep} />,
        () => <OptimizationScreen next={nextStep} />,
        () => <CPUScreen next={nextStep} />,
        () => <GPUScreen next={nextStep} />,
        // ActionsScreen is the final step and does not require a 'next' prop.
        () => <ActionsScreen />,
    ];

    return (
        <div className="relative">
            <BackButton />
            {screens[currentStep]()}
            <ProgressIndicator />
        </div>
    );
};

export default OnboardingFlow;
