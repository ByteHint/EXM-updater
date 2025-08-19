import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";

function DevicesToggle() {
    const [value, setValue] = useState<string>("1");
    return (
        <ToggleGroup
            type="single"
            value={value}
            onValueChange={(v) => v && setValue(v)}
            className="rounded-full bg-[#111219] border border-[#332E474D] p-1 overflow-hidden"
        >
            <ToggleGroupItem
                value="1"
                className="first:rounded-l-full last:rounded-r-full rounded-full data-[state=on]:bg-[#FF2E79] data-[state=on]:text-black text-gray-300 px-4 py-2 hover:bg-[#FF2E79]/20 transition-colors"
            >
                1 Device
            </ToggleGroupItem>
            <ToggleGroupItem
                value="2"
                className="first:rounded-l-full last:rounded-r-full rounded-full data-[state=on]:bg-[#FF2E79] data-[state=on]:text-black text-gray-300 px-4 py-2 hover:bg-[#FF2E79]/20 transition-colors"
            >
                2 Devices
            </ToggleGroupItem>
            <ToggleGroupItem
                value="3"
                className="first:rounded-l-full last:rounded-r-full rounded-full data-[state=on]:bg-[#FF2E79] data-[state=on]:text-black text-gray-300 px-4 py-2 hover:bg-[#FF2E79]/20 transition-colors"
            >
                3 Devices
            </ToggleGroupItem>
            <ToggleGroupItem
                value="4"
                className="first:rounded-l-full last:rounded-r-full rounded-full data-[state=on]:bg-[#FF2E79] data-[state=on]:text-black text-gray-300 px-4 py-2 hover:bg-[#FF2E79]/20 transition-colors"
            >
                4 Devices
            </ToggleGroupItem>
        </ToggleGroup>
    );
}

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const handleClose = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/dashboard");
        }
    };
    return (
        <div className="relative w-full h-full p-6 text-white">
            <Button
                variant="ghost"
                className="absolute top-2 right-4 w-9 h-9 p-0 hover:bg-[#2a2a36]"
                onClick={handleClose}
                aria-label="Close"
                title="Close"
            >
                <X className="w-4 h-4 text-gray-400" />
            </Button>
            <h1 className="text-4xl text-center font-bold mb-3">Achieve maximum performance</h1>
            <p className="block text-gray-400 text-center text-sm mb-8 mx-auto max-w-[720px] leading-relaxed">
                Upgrade to Premium and unlock even more tweaks
                <br />
                that will help you dominate your next game
            </p>

            {/* Devices selector */}
            <div className="flex justify-center mb-10">
                <DevicesToggle />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#1A1A24] border border-[#332E474D]">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-2">Monthly</h2>
                        <p className="text-gray-400 mb-4">Basic features to get started.</p>
                        <Button className="bg-[#2a2a36] hover:bg-[#3a3a46]">Current Plan</Button>
                    </CardContent>
                </Card>
                <Card className="bg-[#1A1A24] border border-[#332E474D]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-pink-400" size={18} />
                            <h2 className="text-xl font-semibold mb-2">Premium</h2>
                        </div>
                        <p className="text-gray-400 mb-4">Unlock all pro features.</p>
                        <Button className="bg-[#818CF8] hover:bg-[#818CF8]/90 text-black">
                            Upgrade
                        </Button>
                    </CardContent>
                </Card>
                <Card className="bg-[#1A1A24] border border-[#332E474D]">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-2">Enterprise</h2>
                        <p className="text-gray-400 mb-4">For teams and organizations.</p>
                        <Button
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-gray-700"
                        >
                            Contact sales
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Pricing;
