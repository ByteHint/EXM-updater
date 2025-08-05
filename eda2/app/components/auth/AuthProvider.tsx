// app/components/auth/AuthProvider.tsx

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";

/**
 * AuthInitializer: A component that handles the initial authentication check.
 *
 * This component's sole responsibility is to trigger the `validateSession` action
 * from the Zustand store when the application first mounts. It does not render
 * any UI itself and does not provide a React Context. It's a "set-it-and-forget-it"
 * component that hooks into the React lifecycle to initialize our auth state.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {React.ReactElement} The children passed to the component.
 */
export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Select the `validateSession` action from our global Zustand store.
    // We use this "selector" syntax to ensure this component doesn't re-render
    // unnecessarily when other state properties (like `user` or `isLoading`) change.
    const validateSession = useAuthStore((state) => state.validateSession);

    // The useEffect hook runs only once when the component mounts,
    // thanks to the empty dependency array [].
    useEffect(() => {
        validateSession();
    }, [validateSession]); // Dependency array ensures this runs once

    // This component doesn't render any UI. It simply returns the children
    // that are passed to it, allowing the rest of the app to render normally.
    return <>{children}</>;
};

// Note: Because this component no longer uses React Context, you could technically
// rename the file from `AuthProvider.tsx` to `AuthInitializer.tsx` for clarity,
// but keeping the original name is also fine.
