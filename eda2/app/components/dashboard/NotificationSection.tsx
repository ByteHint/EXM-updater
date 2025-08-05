import { AppWindow, BatteryCharging, Gamepad2, Settings, Shield, Sparkles } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface NotificationSectionProps {
    onTabChange?: (tab: string) => void;
}

export const NotificationSection = ({ onTabChange }: NotificationSectionProps) => {
    const [activeTab, setActiveTab] = useState("core");

    const navItems = [
        { id: "core", label: "Core", icon: Settings },
        { id: "power", label: "Power", icon: BatteryCharging },
        { id: "security", label: "Security", icon: Shield },
        { id: "qol", label: "QOL", icon: Sparkles },
        { id: "apps", label: "Apps", icon: AppWindow },
        { id: "games", label: "Games", icon: Gamepad2 },
    ];

    const handleTabChange = (newTab: string) => {
        setActiveTab(newTab);
        onTabChange?.(newTab);
    };

    return (
        <nav className="flex w-full h-[72px] items-center border-b-[1.5px] border-[#14141e] py-4">
            <ToggleGroup
                type="single"
                value={activeTab}
                onValueChange={(val) => val && handleTabChange(val)}
                className="flex items-center gap-2.5"
            >
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <ToggleGroupItem
                            key={item.id}
                            value={item.id}
                            aria-label={item.label}
                            className={`inline-flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-[10px] overflow-hidden transition-colors
                ${isActive ? "bg-core-grey800 border border-[#1e1e28]" : ""}
              `}
                        >
                            <Icon
                                size={18}
                                className={`${isActive ? "text-white" : "text-core-grey600"}`}
                            />
                            <span
                                className={`text-[14px] leading-[20px] tracking-[0px] whitespace-nowrap mt-[-0.75px] font-text-sm-leading-5-medium
                  ${isActive ? "text-white" : "text-core-grey600"}
                `}
                            >
                                {item.label}
                            </span>
                        </ToggleGroupItem>
                    );
                })}
            </ToggleGroup>
        </nav>
    );
};
