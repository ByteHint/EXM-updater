// write a code for Sucess page
import React from "react";
import AuthLayout from "./AuthLayout";

export default function Success({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
    return (
        <AuthLayout title="Success">
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-bold text-white">Your are good to go!</h1>
                <p className="text-sm text-gray-400">You can now sign in with your new password.</p>
                <button onClick={onSwitchToSignIn} className="mt-4 text-blue-500 hover:underline">
                    Go to Sign In
                </button>
            </div>
        </AuthLayout>
    );
}
