import {
    ChevronDown,
    Cpu,
    Download,
    Gamepad,
    Home,
    LayoutDashboard,
    PanelLeft,
    PanelRight,
    Rocket,
    Router,
    Search,
    Settings,
    Sparkles,
    SquareSlash,
    WandSparkles,
    Wrench,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";

interface SidebarProps {
    onCollapseChange?: (isCollapsed: boolean) => void;
    onSectionChange?: (section: string) => void;
}

export default function Sidebar({ onCollapseChange, onSectionChange }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState("General");

    const handleToggle = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
        onCollapseChange?.(collapsed);
    };

    const handleSectionClick = (section: string) => {
        console.warn("Sidebar: Section clicked:", section);
        setActiveSection(section);
        onSectionChange?.(section);
    };

    const mainMenuItems = [
        { label: "General", icon: LayoutDashboard, premium: false },
        { label: "Hardware", icon: Cpu, premium: false },
        // Replaced missing BrushCleaning icon with Wrench
        { label: "Debloat", icon: Wrench, premium: false },
        { label: "Network", icon: Router, premium: false },
        { label: "EXM Game Mode", icon: Gamepad, premium: true },
        { label: "Advanced", icon: Rocket, premium: true },
        { label: "BIOS", icon: Settings, premium: true },
    ];

    const generalMenuItems = [
        { label: "Home", icon: Home },
        { label: "Backups", icon: Download },
        { label: "Fixes", icon: Wrench },
    ];

    return (
        <>
            {isCollapsed && (
                <Button
                    onClick={() => handleToggle(false)}
                    className="fixed top-4 left-5 z-50 w-12 h-12 p-0 bg-[#0f0f18] border border-[#14141e] rounded-xl hover:bg-[#1a1a24] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    variant="ghost"
                >
                    <PanelLeft className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                </Button>
            )}

            <aside
                className={`relative bg-[#0f0f18] border-r border-[#14141e] transition-all duration-300 ease-in-out ${
                    isCollapsed ? "w-0 overflow-hidden" : "w-[240px]"
                } h-[720px]`}
            >
                <div
                    className={`transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
                >
                    <div className="flex justify-between items-center px-5 py-3">
                        <img className="w-[55px] h-[27px]" alt="Logo" src="res://icons/logo.png" />
                        <Button
                            onClick={() => handleToggle(true)}
                            className="w-8 h-8 p-0 hover:bg-[#1a1a24] rounded-md transition-colors"
                            variant="ghost"
                        >
                            <PanelRight className="w-5 h-5 text-gray-500 hover:text-white transition-colors" />
                        </Button>
                    </div>

                    <Separator className="w-full h-px bg-[#1e1e28]" />

                    <div className="flex justify-center items-center px-3 mt-4">
                        <div className="relative w-full max-w-md">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>

                            <Input
                                className="h-[38px] pl-10 pr-10 bg-[#1a1a24] border border-[#2a2a36] rounded-[10px] text-sm text-gray-400 w-full"
                                placeholder="Search Anything"
                            />

                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <SquareSlash className="w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <nav className="px-3 mt-6">
                        <div className="ml-3.5 space-y-3">
                            <div className="flex items-center gap-3">
                                <WandSparkles className="w-5 h-5 text-pink-500" />
                                <span className="text-sm font-medium text-white">AI Assistant</span>
                            </div>

                            <div className="space-y-5">
                                {/* General Section */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-gray-400">General</h3>
                                    <div className="space-y-3.5">
                                        {generalMenuItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center gap-3 cursor-pointer ${
                                                    activeSection === item.label
                                                        ? "text-white"
                                                        : "text-gray-500"
                                                }`}
                                                onClick={() => handleSectionClick(item.label)}
                                            >
                                                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                                                <span className="text-sm font-medium">
                                                    {item.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Section */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-gray-400">Main</h3>
                                    <div className="space-y-4.5 w-[188px]">
                                        {mainMenuItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center justify-between w-full cursor-pointer ${
                                                    activeSection === item.label
                                                        ? "text-white"
                                                        : "text-gray-500"
                                                }`}
                                                onClick={() => handleSectionClick(item.label)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.icon && (
                                                        <item.icon className="w-3.5 h-3.5" />
                                                    )}
                                                    <span className="text-sm font-medium">
                                                        {item.label}
                                                    </span>
                                                </div>
                                                {item.premium && (
                                                    <Sparkles className="w-5 h-5 text-pink-700" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Upgrade to Premium */}
                    <div className="absolute w-[174px] left-[26px] bottom-[80px]">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-3 p-0 hover:bg-transparent"
                        >
                            <Sparkles className="w-3 h-3 text-pink-400" />
                            <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text">
                                Upgrade to Premium
                            </span>
                        </Button>
                    </div>

                    {/* User Profile */}
                    <Card className="absolute w-[216px] h-14 bottom-[20px] p-0 left-3 bg-[#1e1e28] rounded-xl border border-[#2a2a36]">
                        <CardContent className="p-0">
                            <div className="flex items-center gap-3 p-2">
                                <Avatar className="w-10 h-10">
                                    <AvatarFallback>P</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center justify-between flex-1">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white">
                                            Pigeon
                                        </span>
                                        <span className="text-xs text-gray-500">Free User</span>
                                    </div>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </aside>
        </>
    );
}
