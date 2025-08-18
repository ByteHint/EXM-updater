// app/App.tsx (Corrected)

import { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useShallow } from "zustand/react/shallow"; // 1. Import useShallow

function AppContent() {
    // 2. Wrap the selector with useShallow to prevent the infinite loop
    const {
        isLoading,
        error,
        isAuthenticated,
        validateSession,
        initializeOAuthListener,
        cleanupOAuthListener,
    } = useAuthStore(
        useShallow((state) => ({
            isLoading: state.isLoading,
            error: state.error,
            isAuthenticated: state.isAuthenticated,
            validateSession: state.validateSession,
            initializeOAuthListener: state.initializeOAuthListener,
            cleanupOAuthListener: state.cleanupOAuthListener,
        })),
    );

    // Initialize OAuth listener and validate session on app start
    useEffect(() => {
        console.warn("[APP] Initializing app...");
        initializeOAuthListener();
        validateSession();

        // Cleanup on unmount
        return () => {
            console.warn("[APP] Cleaning up app...");
            cleanupOAuthListener();
        };
    }, [validateSession, initializeOAuthListener, cleanupOAuthListener]);

    // Routing is handled by the router guards; avoid forced navigations here to prevent flicker

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

    if (error && !isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
                <div className="text-center">
                    <div className="text-red-400 mb-4">An Error Occurred</div>
                    <div className="text-white text-sm">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <AppRouter />
        </>
    );
}

export default function App() {
    return <AppContent />;
}
