// app/components/router/AppRouter.tsx

import React from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { useAuthStore } from "@/app/store/useAuthStore"; // Corrected import path

// Import your page components
import Dashboard from "@/app/components/dashboard/Dashboard"; // Assuming paths
import Welcome from "@/app/components/welcome/Welcome";
import OAuthCallback from "@/app/components/auth/OAuthCallback";
import Pricing from "@/app/components/pricing/Pricing";
// import TweaksPage from "@/components/tweaks/TweaksPage"; // Example for a new page
// import SettingsPage from "@/components/settings/SettingsPage";
// import ProfilePage from "@/components/profile/ProfilePage";
// import TweaksCategoryPage from "@/components/tweaks/TweaksCategoryPage";

/**
 * ProtectedRoute: A layout component for authenticated users.
 * If the user is authenticated, it renders the child routes via <Outlet />.
 * Otherwise, it redirects them to the /welcome page.
 * The initial `isLoading` state is handled by the top-level App.tsx, so no loader is needed here.
 */
const ProtectedRoute: React.FC = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/welcome" replace />;
};

/**
 * PublicRoute: A layout component for unauthenticated users.
 * If the user is not authenticated, it renders the child routes (e.g., Welcome/Login page).
 * Otherwise, it redirects them to the main /dashboard.
 */
const PublicRoute: React.FC = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

/**
 * Root: An intelligent entry point for the app.
 * It redirects to the correct starting page based on auth state.
 */
const Root: React.FC = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return <Navigate to={isAuthenticated ? "/dashboard" : "/welcome"} replace />;
};

const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* OAuth Callback Route - No authentication required */}
            <Route path="/auth/callback" element={<OAuthCallback />} />

            {/* Public routes are nested under the PublicRoute layout */}
            <Route element={<PublicRoute />}>
                <Route path="/welcome" element={<Welcome />} />
                {/* You can add other public routes like /signup here */}
            </Route>

            {/* Protected routes are nested under the ProtectedRoute layout */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pricing" element={<Pricing />} />
                {/* <Route path="/tweaks" element={<TweaksPage />} />
        <Route path="/tweaks/:category" element={<TweaksCategoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} /> */}
            </Route>

            {/* --- Default Redirects --- */}
            {/* The root path intelligently redirects based on auth status */}
            <Route path="/" element={<Root />} />

            {/* Any other unknown path will be redirected to the root */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;
