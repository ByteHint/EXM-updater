"use client";

import { Zap, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export default function PremiumBanner() {
    const handleUpgrade = () => {
        // TODO: Implement upgrade functionality
        console.log("Upgrading to premium");
    };

    return (
        <div className="bg-[#1A1A1A] border border-[#E91E63]/20 rounded-lg p-2 w-[438px]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#E91E63]" />
                    <span className="text-xs text-white">
                        Upgrade to Premium for unlimited AI usage
                    </span>
                </div>
                <Button
                    onClick={handleUpgrade}
                    className="bg-[#E91E63] hover:bg-[#E91E63]/90 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                >
                    Upgrade now
                    <ArrowRight className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
}
