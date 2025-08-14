// app/renderer.tsx

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { WindowContextProvider, menuItems } from "@/lib/window"; // Keep template's window context
import { AuthInitializer } from "@/app/components/auth/AuthProvider";

import "./styles/app.css";

// This component can remain as is. Its job is to hide the initial HTML
// loading screen after the JS bundle has loaded.
const AppWithLoading = () => {
    useEffect(() => {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.style.display = "none";
        }
    }, []);

    return <App />;
};

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            {/*
        AuthInitializer's only job is to live in the app so its useEffect
        hook runs once. It does not provide any context.
      */}
            <AuthInitializer>
                {/* WindowContextProvider is for the custom titlebar from the template */}
                <WindowContextProvider titlebar={{ title: "", icon: "", menuItems }}>
                    <AppWithLoading />
                </WindowContextProvider>
            </AuthInitializer>
        </BrowserRouter>
    </React.StrictMode>,
);
