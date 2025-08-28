import {
    AppWindow,
    BatteryCharging,
    Gamepad2,
    Settings,
    Shield,
    Sparkles,
    Cpu,
    Gpu,
    Monitor,
    Keyboard,
    MemoryStick,
    Wrench,
    Trash,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface NotificationSectionProps {
    onTabChange?: (tab: string) => void;
    activeSidebarSection?: string;
}

export const NotificationSection = ({
    onTabChange,
    activeSidebarSection,
}: NotificationSectionProps) => {
    // Reset activeTab when sidebar section changes
    const [activeTab, setActiveTab] = useState(() => {
        return activeSidebarSection === "Hardware" ? "cpu" : "core";
    });

    const navItems = [
        { id: "core", label: "Core", icon: Settings },
        { id: "power", label: "Power", icon: BatteryCharging },
        { id: "security", label: "Security", icon: Shield },
        { id: "qol", label: "QOL", icon: Sparkles },
        { id: "apps", label: "Apps", icon: AppWindow },
        { id: "games", label: "Games", icon: Gamepad2 },
    ];

    // Hardware
    const hardwareNavItems = [
        { id: "cpu", label: "CPU", icon: Cpu },
        { id: "gpu", label: "GPU", icon: Gpu },
        { id: "ram", label: "RAM", icon: MemoryStick },
        { id: "monitor", label: "Monitor", icon: Monitor },
        { id: "peripherals", label: "Peripherals", icon: Keyboard },
    ];

    const debloatNavItems = [
        { id: "clean", label: "Clean Up", icon: Trash },
        { id: "services", label: "Services", icon: Wrench },
        { id: "deapps", label: "Apps", icon: AppWindow },
        { id: "autoruns", label: "Autoruns", icon: Wrench },
    ];

    // Determine which navigation items to show based on sidebar section
    const currentNavItems =
        activeSidebarSection === "Hardware"
            ? hardwareNavItems
            : activeSidebarSection === "Debloat"
            ? debloatNavItems
            : navItems;

    // Update activeTab when sidebar section changes
    useEffect(() => {
        console.warn("NotificationSection: Sidebar section changed to:", activeSidebarSection);
        if (activeSidebarSection === "Hardware") {
            console.warn("NotificationSection: Setting activeTab to cpu");
            setActiveTab("cpu");
            // Don't automatically call onTabChange here, let user click
        } else if (activeSidebarSection === "General") {
            console.warn("NotificationSection: Setting activeTab to core");
            setActiveTab("core");
            // Don't automatically call onTabChange here, let user click
        } else if (activeSidebarSection === "Debloat") {
            console.warn("NotificationSection: Setting activeTab to clean");
            setActiveTab("clean");
            // Don't automatically call onTabChange here, let user click
        }
    }, [activeSidebarSection]);

    // Also log the current state for debugging
    console.warn("NotificationSection: Current activeTab:", activeTab);
    console.warn("NotificationSection: Current activeSidebarSection:", activeSidebarSection);
    console.warn(
        "NotificationSection: Showing hardware items:",
        activeSidebarSection === "Hardware",
    );
    console.warn(
        "NotificationSection: Showing debloat items:",
        activeSidebarSection === "Debloat",
    );

    const handleTabChange = (newTab: string) => {
        console.warn("NotificationSection: Tab clicked:", newTab);
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
                {currentNavItems.map((item) => {
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
