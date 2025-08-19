import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import { Separator } from "@/app/components/ui/separator";

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
                className="cursor-pointer first:rounded-l-full last:rounded-r-full rounded-full data-[state=on]:bg-[#FF2E79] data-[state=on]:text-black text-gray-300 px-4 py-2 hover:bg-[#FF2E79]/20 transition-colors"
            >
                1 Device
            </ToggleGroupItem>
            <ToggleGroupItem
                value="2"
                className="cursor-pointer first:rounded-l-full last:rounded-r-full rounded-full data-[state=on]:bg-[#FF2E79] data-[state=on]:text-black text-gray-300 px-4 py-2 hover:bg-[#FF2E79]/20 transition-colors"
            >
                2 Devices
            </ToggleGroupItem>
            <ToggleGroupItem
                value="3"
                className="cursor-pointer first:rounded-l-full last:rounded-r-full rounded-full data-[state=on]:bg-[#FF2E79] data-[state=on]:text-black text-gray-300 px-4 py-2 hover:bg-[#FF2E79]/20 transition-colors"
            >
                3 Devices
            </ToggleGroupItem>
            <ToggleGroupItem
                value="4"
                className="cursor-pointer first:rounded-l-full last:rounded-r-full rounded-full data-[state=on]:bg-[#FF2E79] data-[state=on]:text-black text-gray-300 px-4 py-2 hover:bg-[#FF2E79]/20 transition-colors"
            >
                4 Devices
            </ToggleGroupItem>
        </ToggleGroup>
    );
}

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
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
            <h1 className="text-4xl text-center font-bold mb-3">
                Achieve{" "}
                <span className="bg-gradient-to-r from-[#FF2E79] via-[#818CF8] to-[#22D3EE] bg-clip-text text-transparent">
                    maximum
                </span>{" "}
                performance
            </h1>
            <p className="block text-gray-400 text-center text-sm mb-8 mx-auto max-w-[720px] leading-relaxed">
                Upgrade to Premium and unlock even more tweaks
                <br />
                that will help you dominate your next game
            </p>

            {/* Devices selector */}
            <div className="flex justify-center mb-10">
                <DevicesToggle />
            </div>

            <div className="flex flex-col items-center md:flex-row md:justify-center gap-2 md:gap-5">
                <Card
                    className={`w-[300px] h-[430px] bg-[#1A1A24] border border-[#332E474D] ${selectedPlan === "monthly" ? "border-[#818CF8]" : "border-[#332E474D]"}`}
                    onClick={() => setSelectedPlan("monthly")}
                    role="button"
                >
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold mb-2 -mt-5">Monthly</h2>
                        <span className="text-[#FFFFFF] text-3xl font-medium">€9,99</span>{" "}
                        <span className="text-gray-400 text-sm font-medium">/month</span>
                        <p className="text-gray-400 mb-8 mt-2">Billed monthly</p>
                        <Button className="text-center text-white bg-[##14141E] hover:bg-[#3a3a46] w-full rounded-[12px] border border-[#FF2E79]">
                            Subscribe now
                        </Button>
                        <Separator className="w-full h-px bg-gray-700/30 mb-4 mt-8" />
                        <h2 className="text-base font-semibold mb-2 mt-2">Features</h2>
                        <ul className="flex flex-col gap-2">
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">No Ads</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">Advanced Tweaks</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">EXM Game Mode</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">BIOS Tweaks</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">Higher AI limits</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
                <Card
                    className={`relative w-[300px] h-[430px] cursor-pointer bg-[#1A1A24] border ${selectedPlan === "annually" ? "border-[#818CF8]" : "border-[#332E474D]"}`}
                    onClick={() => setSelectedPlan("annually")}
                    role="button"
                >
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold mb-2 -mt-5">Annually</h2>
                        <div className="absolute top-6 right-6">
                            <button
                                className="inline-flex items-center justify-center rounded-full bg-[#FF2E79] text-black text-xs font-semibold px-4 py-2 shadow-lg"
                                onClick={() => setSelectedPlan("annually")}
                            >
                                Save 50%
                            </button>
                        </div>
                        <span className="text-[#FFFFFF] text-3xl font-medium">€5,99</span>{" "}
                        <span className="text-gray-400 text-sm font-medium">/year</span>
                        <p className="text-gray-400 mb-8 mt-2">Billed yearly</p>
                        <Button className="text-center text-white bg-[##14141E] hover:bg-[#3a3a46] w-full rounded-[12px] border border-[#FF2E79]">
                            Subscribe now
                        </Button>
                        <Separator className="w-full h-px bg-gray-700/30 mb-4 mt-8" />
                        <h2 className="text-base font-semibold mb-2 mt-2">Features</h2>
                        <ul className="flex flex-col gap-2">
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">No Ads</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">Advanced Tweaks</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">EXM Game Mode</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">BIOS Tweaks</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">Higher AI limits</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
                <Card
                    className={`w-[300px] h-[430px] cursor-pointer bg-[#1A1A24] border ${selectedPlan === "quarterly" ? "border-[#818CF8]" : "border-[#332E474D]"}`}
                    onClick={() => setSelectedPlan("quarterly")}
                    role="button"
                >
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold mb-2 -mt-5">Quarterly</h2>
                        <span className="text-[#FFFFFF] text-3xl font-medium">€7,99</span>{" "}
                        <span className="text-gray-400 text-sm font-medium">/quarterly</span>
                        <p className="text-gray-400 mb-8 mt-2">Billed quarterly</p>
                        <Button className="text-center text-white bg-[##14141E] hover:bg-[#3a3a46] w-full rounded-[12px] border border-[#FF2E79]">
                            Subscribe now
                        </Button>
                        <Separator className="w-full h-px bg-gray-700/30 mb-4 mt-8" />
                        <h2 className="text-base font-semibold mb-2 mt-2">Features</h2>
                        <ul className="flex flex-col gap-2">
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">No Ads</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">Advanced Tweaks</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">EXM Game Mode</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">BIOS Tweaks</span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3.33398 9.66675C3.33398 9.66675 4.33398 9.66675 5.66732 12.0001C5.66732 12.0001 9.37318 5.88897 12.6673 4.66675"
                                        stroke="#818CF8"
                                        stroke-width="1.25"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm">Higher AI limits</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Pricing;
