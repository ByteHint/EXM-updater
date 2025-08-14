// app/App.tsx (Corrected)

import AppRouter from "./router/AppRouter";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useShallow } from "zustand/react/shallow"; // 1. Import useShallow

function AppContent() {
    // 2. Wrap the selector with useShallow to prevent the infinite loop
    const { isLoading, error } = useAuthStore(
        useShallow((state) => ({
            isLoading: state.isLoading,
            error: state.error,
        })),
    );

    // The rest of this component is perfect and does not need to change.
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                    <div className="text-white">Loading Session...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
                <div className="text-center">
                    <div className="text-red-400 mb-4">An Error Occurred</div>
                    <div className="text-white text-sm">{error}</div>
                </div>
            </div>
        );
    }

    return <AppRouter />;
}

export default function App() {
    return <AppContent />;
}
