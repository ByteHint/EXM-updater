import React from "react";

type AuthLayoutProps = {
    title: string;
    children: React.ReactNode;
};

export default function AuthLayout({ title, children }: AuthLayoutProps) {
    return (
        <div className="flex flex-col items-center justify-between gap-4 w-full h-full">
            {/* Top Section */}
            <div className="flex flex-col gap-[48px] pt-[94px] items-center">
                {/* Logo + Heading */}
                <div className="flex flex-col items-center">
                    <img
                        src="res://icons/logo.png"
                        alt="EXM Tweaks Logo"
                        className="w-16 h-8 mb-4"
                    />
                    <h1 className="text-3xl font-bold text-center">{title}</h1>
                </div>

                {/* Dynamic Content */}
                <div className="w-[321px] flex flex-col items-center">{children}</div>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-700 font-normal mb-[20px] leading-5 max-h-[20px]">
                © 2025 EXM Tweaks
            </div>
        </div>
    );
}
