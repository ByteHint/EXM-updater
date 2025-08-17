import {
    TriangleAlertIcon,
    SlidersHorizontal,
    CircleCheck,
    ChevronDown,
    Wrench,
    X,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { useState, useEffect } from "react";
import { Slider } from "@heroui/slider";

interface SettingCardProps {
    title: string;
    description: string;
    alertCount: number;
    isEnabled: boolean;
    category: string;
    hasConfigure?: boolean;
    uninstall?: boolean;
    dropdown?: boolean;
    optimize?: boolean;
}

interface SettingsSectionProps {
    activeCategory?: string;
    searchQuery?: string;
    filterState?: "all" | "enabled" | "disabled" | "alerts";
    sortState?: "name" | "alerts" | "status";
    sortDirection?: "asc" | "desc";
    isSidebarCollapsed?: boolean;
}

export const SettingsSection = ({
    activeCategory = "core",
    searchQuery = "",
    filterState = "all",
    sortState = "name",
    sortDirection = "asc",
    isSidebarCollapsed = false,
}: SettingsSectionProps) => {
    // Define the settings data organized by category
    const allSettingsData: SettingCardProps[] = [
        // Core Settings
        {
            title: "Set System32 priority",
            description:
                "Boosts performance by prioritizing essential system tasks over less important ones.",
            alertCount: 1,
            isEnabled: false,
            category: "core",
        },
        {
            title: "Disable Windows Defender",
            description:
                "Disables real-time protection to improve system performance and reduce resource usage.",
            alertCount: 2,
            isEnabled: true,
            category: "core",
        },
        {
            title: "Disable Windows animations",
            description: "Removes visual effects and animations to speed up the user interface.",
            alertCount: 0,
            isEnabled: true,
            category: "core",
        },

        // Power Settings
        {
            title: "Mouse Data Queue Size",
            description:
                "Increase mouse responsiveness and accuracy by prioritizing essential system",
            alertCount: 0,
            isEnabled: true,
            hasConfigure: true,
            category: "power",
        },
        {
            title: "Disable USB Power Saving",
            description:
                "Prevents USB devices from entering power saving mode that can cause disconnections.",
            alertCount: 1,
            isEnabled: false,
            category: "power",
            dropdown: true,
        },
        {
            title: "CPU Boost Settings",
            description: "Optimizes CPU boost behavior for consistent high performance.",
            alertCount: 0,
            isEnabled: true,
            category: "power",
        },

        // Security Settings
        {
            title: "Disable UAC",
            description:
                "Disables User Account Control to reduce interruptions and improve workflow.",
            alertCount: 3,
            isEnabled: false,
            category: "security",
        },
        {
            title: "Windows Firewall",
            description:
                "Configures firewall settings for optimal gaming and application performance.",
            alertCount: 1,
            isEnabled: true,
            category: "security",
        },
        {
            title: "SmartScreen Filter",
            description: "Disables SmartScreen to prevent performance impacts from file scanning.",
            alertCount: 2,
            isEnabled: false,
            category: "security",
        },

        // QOL (Quality of Life) Settings
        {
            title: "Dark Mode Theme",
            description: "Enables system-wide dark theme for better visual comfort.",
            alertCount: 0,
            isEnabled: true,
            category: "qol",
        },
        {
            title: "Disable Startup Apps",
            description: "Prevents unnecessary applications from starting with Windows.",
            alertCount: 5,
            isEnabled: true,
            category: "qol",
        },
        {
            title: "Explorer Optimizations",
            description: "Improves File Explorer performance and responsiveness.",
            alertCount: 0,
            isEnabled: true,
            category: "qol",
        },

        // Apps Settings
        {
            title: "Spotify",
            description:
                "Spotify is a digital music service that gives you access to millions of songs.",
            alertCount: 0,
            isEnabled: true,
            optimize: true,
            category: "apps",
        },
        {
            title: "Chrome",
            description: "Google Chrome is a web browser developed by Google.",
            alertCount: 3,
            isEnabled: false,
            optimize: true,
            category: "apps",
        },
        {
            title: "Discord",
            description: "Discord is a voice, video, and text communication app.",
            alertCount: 0,
            isEnabled: true,
            optimize: true,
            category: "apps",
        },

        // Game Settings
        {
            title: "Valorant",
            description: "Riot Games",
            alertCount: 0,
            isEnabled: true,
            category: "games",
        },
        {
            title: "Splitgate",
            description: "1047 Games",
            alertCount: 1,
            isEnabled: true,
            category: "games",
        },
        {
            title: "Fortnite",
            description: "Epic Games",
            alertCount: 0,
            isEnabled: true,
            category: "games",
        },
        {
            title: "The Finals",
            description: "Embark Studios",
            alertCount: 0,
            isEnabled: true,
            category: "games",
        },
        {
            title: "Counter-Strike 2",
            description: "Valve",
            alertCount: 0,
            isEnabled: true,
            category: "games",
        },
        {
            title: "Apex Legends",
            description: "Respawn",
            alertCount: 0,
            isEnabled: true,
            category: "games",
        },

        // CPU Settings
        {
            title: "Optimize Processor Scheduling",
            description:
                "Prioritize background services or programs for better multitasking and system balance.",
            alertCount: 1,
            isEnabled: false,
            category: "cpu",
        },
        {
            title: "Enable Turbo Boost",
            description:
                "Boost CPU clock speed dynamically for enhanced performance during heavy loads.",
            alertCount: 2,
            isEnabled: true,
            category: "cpu",
        },
        {
            title: "Disable Background Animations",
            description:
                "Turn off visual effects to reduce CPU load and improve system responsiveness.",
            alertCount: 0,
            isEnabled: true,
            category: "cpu",
        },

        // GPU Settings
        {
            title: "Enable Hardware Acceleration",
            description:
                "Leverage GPU for rendering tasks to improve performance in graphics-intensive applications.",
            alertCount: 1,
            isEnabled: false,
            category: "gpu",
        },
        {
            title: "Set Max Performance Mode",
            description:
                "Force the GPU to run at maximum performance level for consistent frame rates.",
            alertCount: 2,
            isEnabled: true,
            category: "gpu",
        },
        {
            title: "Disable V-Sync",
            description:
                "Reduce input lag and screen tearing by disabling vertical synchronization.",
            alertCount: 0,
            isEnabled: true,
            category: "gpu",
        },

        // RAM Settings
        {
            title: "Enable Memory Compression",
            description: "Reduce memory usage by compressing unused pages to improve multitasking.",
            alertCount: 2,
            isEnabled: false,
            category: "ram",
        },
        {
            title: "Clear Standby Memory",
            description: "Free up RAM by clearing standby cache for better system performance.",
            alertCount: 1,
            isEnabled: true,
            category: "ram",
        },
        {
            title: "Optimize Paging File Size",
            description: "Adjust virtual memory size for balanced performance and storage usage.",
            alertCount: 0,
            isEnabled: true,
            category: "ram",
        },

        // Monitor Settings
        {
            title: "Enable Adaptive Refresh Rate",
            description:
                "Reduce screen tearing by syncing refresh rate with frame output dynamically.",
            alertCount: 0,
            isEnabled: true,
            category: "monitor",
            hasConfigure: true,
        },
        {
            title: "Calibrate Display Colors",
            description: "Adjust color profiles for accurate and vibrant display output.",
            alertCount: 1,
            isEnabled: true,
            category: "monitor",
        },
        {
            title: "Reduce Screen Flicker",
            description:
                "Enable flicker-free mode for better visual comfort and reduced eye strain.",
            alertCount: 0,
            isEnabled: true,
            category: "monitor",
        },

        // Peripherals Settings
        {
            title: "Adjust Mouse Polling Rate",
            description:
                "Increase mouse responsiveness and accuracy for gaming and productivity tasks.",
            alertCount: 0,
            isEnabled: true,
            category: "peripherals",
            hasConfigure: true,
        },
        {
            title: "Enable Low-Latency Input Mode",
            description: "Reduce input delay for keyboards and mice during fast-paced activities.",
            alertCount: 3,
            isEnabled: false,
            category: "peripherals",
        },
        {
            title: "Disable Extra Peripheral Animations",
            description: "Turn off unnecessary LED or effect animations to save system resources.",
            alertCount: 0,
            isEnabled: true,
            category: "peripherals",
        },
    ];

    // Filter settings based on active category, search query, and filter state
    const filteredSettings = allSettingsData.filter((setting) => {
        // Simple category matching since we're now using specific categories
        const matchesCategory = setting.category === activeCategory;

        const matchesSearch =
            searchQuery === "" ||
            setting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            setting.description.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesFilter = true;
        switch (filterState) {
            case "enabled":
                matchesFilter = setting.isEnabled;
                break;
            case "disabled":
                matchesFilter = !setting.isEnabled;
                break;
            case "alerts":
                matchesFilter = setting.alertCount > 0;
                break;
            case "all":
            default:
                matchesFilter = true;
                break;
        }

        return matchesCategory && matchesSearch && matchesFilter;
    });

    // Create a flat array for CSS Grid layout instead of rows
    const sortedSettings = [...filteredSettings].sort((a, b) => {
        let compareValue = 0;

        switch (sortState) {
            case "name":
                compareValue = a.title.localeCompare(b.title);
                break;
            case "alerts":
                compareValue = a.alertCount - b.alertCount;
                break;
            case "status":
                compareValue = Number(a.isEnabled) - Number(b.isEnabled);
                break;
            default:
                compareValue = 0;
        }

        return sortDirection === "asc" ? compareValue : -compareValue;
    });

    // Games-only local UI state
    const [isGameListLoading, setIsGameListLoading] = useState(false);
    const [gameMode, setGameMode] = useState<"high" | "competitive">("high");
    const [exclusiveFSE, setExclusiveFSE] = useState(true);

    useEffect(() => {
        let t: ReturnType<typeof setTimeout> | undefined;

        if (activeCategory === "games") {
            setIsGameListLoading(true);
            t = setTimeout(() => setIsGameListLoading(false), 1200);
        } else {
            setIsGameListLoading(false);
        }

        return () => {
            if (t) clearTimeout(t);
        };
    }, [activeCategory]);

    return (
        <section className="flex flex-col w-full items-start gap-3.5 pb-6">
            <div className="flex flex-col w-full items-start gap-4 relative">
                {activeCategory === "games" ? (
                    <div className="flex w-full gap-4">
                        <div className="w-[400px] flex-shrink-0 space-y-3">
                            {isGameListLoading ? (
                                <>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div
                                            key={`game-skel-${i}`}
                                            className="h-[64px] rounded-lg bg-[#101019] border border-[#14141e] animate-pulse"
                                        />
                                    ))}
                                </>
                            ) : (
                                <>
                                    {sortedSettings.map((g, i) => (
                                        <div
                                            key={`game-item-${i}`}
                                            className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#101019] border border-[#14141e] hover:bg-[#14141e] cursor-pointer"
                                        >
                                            <div className="min-w-0">
                                                <div className="text-white text-sm truncate">
                                                    {g.title}
                                                </div>
                                                <div className="text-[11px] text-[#81818C] truncate">
                                                    {g.description}
                                                </div>
                                            </div>
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap ${
                                                    g.isEnabled
                                                        ? "bg-[#11271b] text-[#05DF72]"
                                                        : "bg-[#2a1a1f] text-[#F59E0B]"
                                                }`}
                                            >
                                                {g.isEnabled ? "Optimized" : "Not optimized"}
                                            </span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        <div className="flex-1 space-y-3 pt-0">
                            <Card className="bg-[#101019] rounded-xl border border-[#14141e] pt-0">
                                <CardContent className="px-5 pt-5 pb-3">
                                    <div className="flex items-center gap-2 text-white text-lg font-semibold mb-3">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M3.62576 10.8235C3.62576 10.6485 3.62024 10.4815 3.60986 10.3221M3.60986 10.3221C3.51555 8.87387 3.01996 8.05593 2.61619 7.64707C1.91915 8.35293 0.309297 11.1765 2.27767 13.2941L5.45819 11.8823C5.52207 12.1397 5.5989 12.3951 5.6897 12.6478C5.89739 13.2257 6.00123 13.5147 6.34633 13.7573C6.69145 14 7.07252 14 7.83472 14H8.16512C8.92732 14 9.30839 14 9.65352 13.7573C9.99859 13.5147 10.1025 13.2257 10.3101 12.6478C10.4009 12.3951 10.4778 12.1397 10.5417 11.8823L13.7222 13.2941C15.6905 11.1765 14.0807 8.35293 13.3837 7.64707C12.9799 8.05593 12.4843 8.87387 12.39 10.3221M3.60986 10.3221L4.34203 10.0452C4.74771 9.89173 4.95056 9.815 5.06653 9.66187C5.18249 9.50873 5.20311 9.2722 5.24433 8.79927C5.50391 5.82133 6.95039 3.08023 7.99992 2C9.04945 3.08023 10.4959 5.82133 10.7555 8.79927C10.7967 9.2722 10.8173 9.50873 10.9333 9.66187C11.0493 9.815 11.2521 9.89173 11.6578 10.0452L12.39 10.3221M12.39 10.3221C12.3796 10.4815 12.3741 10.6485 12.3741 10.8235"
                                                stroke="white"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M8 6.66669V7.33335"
                                                stroke="white"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M13.3333 5.33333V4.66667M13.3333 2.66667V2"
                                                stroke="white"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M2.66675 5.33333V4.66667M2.66675 2.66667V2"
                                                stroke="white"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        Game User Settings
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5C13.1421 16.5 16.5 13.1421 16.5 9Z"
                                                stroke="#3B3B44"
                                                stroke-width="1.25"
                                            />
                                            <path
                                                d="M9.18164 12.75V9C9.18164 8.64645 9.18164 8.46968 9.07177 8.3598C8.96197 8.25 8.78519 8.25 8.43164 8.25"
                                                stroke="#3B3B44"
                                                stroke-width="1.25"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M8.99414 6H9.00089"
                                                stroke="#3B3B44"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>

                                    <Separator className="mb-4 h-px border-[0.75px] border-dashed border-gray-100/10 bg-transparent" />

                                    <div className="space-y-2">
                                        <label className="flex items-center justify-between text-sm text-[#c6c6cf]">
                                            <span className="flex items-center gap-2">
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M9.00008 8.66667L11.3334 6M9.33341 10C9.33341 10.7364 8.73648 11.3333 8.00008 11.3333C7.26368 11.3333 6.66675 10.7364 6.66675 10C6.66675 9.2636 7.26368 8.66667 8.00008 8.66667C8.73648 8.66667 9.33341 9.2636 9.33341 10Z"
                                                        stroke="#81818C"
                                                        stroke-width="1.25"
                                                        stroke-linecap="round"
                                                    />
                                                    <path
                                                        d="M4 8C4 5.79086 5.79086 4 8 4C8.7286 4 9.41167 4.19479 10 4.53513"
                                                        stroke="#81818C"
                                                        stroke-width="1.25"
                                                        stroke-linecap="round"
                                                    />
                                                    <path
                                                        d="M1.66675 8.00005C1.66675 5.01446 1.66675 3.52168 2.59424 2.59418C3.52174 1.66669 5.01452 1.66669 8.00011 1.66669C10.9856 1.66669 12.4784 1.66669 13.4059 2.59418C14.3334 3.52168 14.3334 5.01446 14.3334 8.00005C14.3334 10.9856 14.3334 12.4784 13.4059 13.4058C12.4784 14.3334 10.9856 14.3334 8.00011 14.3334C5.01452 14.3334 3.52174 14.3334 2.59424 13.4058C1.66675 12.4784 1.66675 10.9856 1.66675 8.00005Z"
                                                        stroke="#81818C"
                                                        stroke-width="1.25"
                                                    />
                                                </svg>
                                                High Performance
                                            </span>
                                            <input
                                                type="radio"
                                                checked={gameMode === "high"}
                                                onChange={() => setGameMode("high")}
                                                className="h-3.5 w-3.5 appearance-none rounded-full border border-gray-400 bg-transparent checked:bg-pink-600 checked:border-pink-600 cursor-pointer"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between text-sm text-[#81818C] opacity-60">
                                            <span className="flex items-center gap-2">
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M5.32426 6.32746L3.78466 5.00868C2.76924 4.13522 2.76584 2.86762 2.65747 2.013C3.76836 2.06572 4.62886 2.16629 5.37822 2.79929L6.16213 3.68991L7.01045 4.64235M12.9715 12.2787L10.9949 10.2788M9.34758 12.2787C9.36265 12.0972 9.48145 11.6267 10.0271 11.1226C10.5167 10.6702 11.5783 9.58625 12.0554 9.11618C12.3257 8.84991 12.7687 8.66311 12.9715 8.66345M10.3788 8.53871L11.2699 9.52458M9.11745 9.62418L10.1136 10.4999M13.641 11.9868C14.1946 11.9879 14.6673 12.3968 14.6663 12.95C14.6652 13.5032 14.1946 13.9883 13.641 13.9873C13.0874 13.9862 12.6605 13.4994 12.6615 12.9462C12.6973 12.3957 13.1045 12.0608 13.641 11.9868Z"
                                                        stroke="#81818C"
                                                        stroke-width="1.25"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                    <path
                                                        d="M3.06404 12.262L5.03602 10.3338M3.04113 8.65809C3.22276 8.67282 3.72913 8.79408 4.18275 9.36075C4.59923 9.88095 5.72256 10.8871 6.19383 11.3629C6.46076 11.6325 6.64745 12.0594 6.64745 12.262M4.84308 9.48662L10.3358 3.10943C11.2296 2.11202 12.4787 2.09022 13.3358 1.99872C13.2613 3.10763 13.1437 3.96542 12.4957 4.70171L5.69981 10.6176M3.33754 12.9992C3.33754 13.5524 2.88876 14.001 2.33515 14.001C1.78155 14.001 1.33276 13.5524 1.33276 12.9992C1.33276 12.446 1.78155 11.9975 2.33515 11.9975C2.88876 11.9975 3.33754 12.446 3.33754 12.9992Z"
                                                        stroke="#81818C"
                                                        stroke-width="1.25"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                                Competitive
                                            </span>
                                            <input
                                                type="radio"
                                                disabled
                                                className="h-3.5 w-3.5 appearance-none rounded-full border border-gray-500 bg-transparent"
                                            />
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4">
                                        <button className="px-4 py-2 rounded-md bg-pink-600 text-[#0A0A14] text-sm w-[260px] h-[38px] cursor-pointer flex items-center justify-center gap-2">
                                            Apply{" "}
                                            <svg
                                                className="relative top-[1px]"
                                                width="15"
                                                height="14"
                                                viewBox="0 0 15 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12.1668 7H2.8335"
                                                    stroke="#14141E"
                                                    stroke-width="1.25"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M9.25006 9.91665C9.25006 9.91665 12.1667 7.76858 12.1667 6.99998C12.1667 6.23138 9.25 4.08331 9.25 4.08331"
                                                    stroke="#14141E"
                                                    stroke-width="1.25"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </button>
                                        <button className="px-4 py-2 rounded-md bg-[#1A1A24] text-white text-sm w-[260px] h-[38px] cursor-pointer flex items-center justify-center gap-2">
                                            Revert to Default{" "}
                                            <svg
                                                width="15"
                                                height="14"
                                                viewBox="0 0 15 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M6.91683 3.5H9.54183C10.9916 3.5 12.1668 4.67525 12.1668 6.125C12.1668 7.57476 10.9916 8.75 9.54183 8.75H2.8335"
                                                    stroke="white"
                                                    stroke-width="1.25"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M4.58348 7C4.58348 7 2.8335 8.28887 2.8335 8.75C2.83349 9.21118 4.5835 10.5 4.5835 10.5"
                                                    stroke="white"
                                                    stroke-width="1.25"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 text-white text-lg font-semibold h-[70px]">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M13.5722 8.90449C12.7792 9.69735 11.2871 9.66655 8.99939 9.66655C7.52752 9.66655 6.33417 8.47142 6.33341 6.99955C6.33341 4.71336 6.30259 3.22045 7.09559 2.42761C7.88852 1.63477 8.23878 1.66687 11.7515 1.66687C12.091 1.66541 12.2619 2.07595 12.0219 2.31598L10.2132 4.12478C9.75412 4.5839 9.75285 5.32824 10.212 5.7873C10.6711 6.24637 11.4155 6.24641 11.8747 5.78741L13.6839 3.97905C13.9239 3.73908 14.3345 3.90991 14.3331 4.24932C14.3331 7.76149 14.3652 8.11169 13.5722 8.90449Z"
                                                stroke="white"
                                                stroke-width="1.5"
                                            />
                                            <path
                                                d="M9.00008 9.66667L4.88569 13.7811C4.14932 14.5174 2.95541 14.5174 2.21903 13.7811C1.48265 13.0447 1.48265 11.8507 2.21903 11.1144L6.33341 7"
                                                stroke="white"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                            />
                                            <path
                                                d="M3.67272 12.3333H3.66675"
                                                stroke="white"
                                                stroke-width="1.33333"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        Additional Tweaks
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5C13.1421 16.5 16.5 13.1421 16.5 9Z"
                                                stroke="#3B3B44"
                                                stroke-width="1.25"
                                            />
                                            <path
                                                d="M9.18164 12.75V9C9.18164 8.64645 9.18164 8.46968 9.07177 8.3598C8.96197 8.25 8.78519 8.25 8.43164 8.25"
                                                stroke="#3B3B44"
                                                stroke-width="1.25"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M8.99414 6H9.00089"
                                                stroke="#3B3B44"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>

                                    <Separator className="mb-4 h-px border-[0.75px] border-dashed border-gray-100/10 bg-transparent" />

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-sm text-[#c6c6cf]">
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M9.99992 1.33331L10.3591 2.92769C10.6637 4.28008 11.7198 5.33619 13.0722 5.64083L14.6666 5.99998L13.0722 6.35913C11.7198 6.66377 10.6637 7.71985 10.3591 9.07225L9.99992 10.6666L9.64078 9.07225C9.33612 7.71985 8.28005 6.66377 6.92765 6.35913L5.33325 5.99998L6.92765 5.64083C8.27998 5.33619 9.33612 4.28008 9.64078 2.9277L9.99992 1.33331Z"
                                                    stroke="#81818C"
                                                    stroke-width="1.25"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M4.66659 8L4.92313 9.13887C5.14073 10.1048 5.89509 10.8592 6.86105 11.0768L7.99992 11.3333L6.86105 11.5899C5.89509 11.8075 5.14073 12.5618 4.92313 13.5278L4.66659 14.6667L4.41005 13.5278C4.19245 12.5618 3.43809 11.8075 2.4721 11.5899L1.33325 11.3333L2.4721 11.0768C3.43809 10.8592 4.19245 10.1049 4.41005 9.13887L4.66659 8Z"
                                                    stroke="#81818C"
                                                    stroke-width="1.25"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                            Exclusive FSE Mode
                                        </span>
                                        <Switch
                                            checked={exclusiveFSE}
                                            onCheckedChange={() => setExclusiveFSE(!exclusiveFSE)}
                                            className="data-[state=checked]:bg-pink-500 data-[state=unchecked]:bg-gray-600 data-[state=unchecked]:border-grey-650"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 mt-3 mb-4">
                                        <button className="px-4 py-2 rounded-md bg-pink-600 text-[#0A0A14] text-sm w-[260px] h-[38px] cursor-pointer flex items-center justify-center gap-2">
                                            Apply{" "}
                                            <svg
                                                className="relative top-[1px]"
                                                width="15"
                                                height="14"
                                                viewBox="0 0 15 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12.1668 7H2.8335"
                                                    stroke="#14141E"
                                                    stroke-width="1.25"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M9.25006 9.91665C9.25006 9.91665 12.1667 7.76858 12.1667 6.99998C12.1667 6.23138 9.25 4.08331 9.25 4.08331"
                                                    stroke="#14141E"
                                                    stroke-width="1.25"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </button>
                                        <button className="px-4 py-2 rounded-md bg-[#1A1A24] text-white text-sm w-[260px] h-[38px] cursor-pointer flex items-center justify-center gap-2">
                                            Revert to Default{" "}
                                            <svg
                                                width="15"
                                                height="14"
                                                viewBox="0 0 15 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M6.91683 3.5H9.54183C10.9916 3.5 12.1668 4.67525 12.1668 6.125C12.1668 7.57476 10.9916 8.75 9.54183 8.75H2.8335"
                                                    stroke="white"
                                                    stroke-width="1.25"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M4.58348 7C4.58348 7 2.8335 8.28887 2.8335 8.75C2.83349 9.21118 4.5835 10.5 4.5835 10.5"
                                                    stroke="white"
                                                    stroke-width="1.25"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <Separator className="mb-4 h-px border-[0.75px] border-dashed border-gray-100/10 bg-transparent" />

                                    <div className="flex items-center gap-2 mt-5">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9.33325 14H10.6666M9.33325 14C8.78099 14 8.33325 13.5522 8.33325 13V11.3333H7.99992M9.33325 14H6.66659M7.99992 11.3333H7.66659V13C7.66659 13.5522 7.21885 14 6.66659 14M7.99992 11.3333V14M6.66659 14H5.33325"
                                                stroke="white"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M10.6666 2H5.33325C3.44763 2 2.50483 2 1.91904 2.58579C1.33325 3.17157 1.33325 4.11438 1.33325 6V7.33333C1.33325 9.21893 1.33325 10.1617 1.91904 10.7475C2.50483 11.3333 3.44763 11.3333 5.33325 11.3333H10.6666C12.5522 11.3333 13.495 11.3333 14.0808 10.7475C14.6666 10.1617 14.6666 9.21893 14.6666 7.33333V6C14.6666 4.11438 14.6666 3.17157 14.0808 2.58579C13.495 2 12.5522 2 10.6666 2Z"
                                                stroke="white"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        <div className="text-white font-semibold text-lg">
                                            NVIDIA Control Panel Settings
                                        </div>
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5C13.1421 16.5 16.5 13.1421 16.5 9Z"
                                                stroke="#3B3B44"
                                                stroke-width="1.25"
                                            />
                                            <path
                                                d="M9.18164 12.75V9C9.18164 8.64645 9.18164 8.46968 9.07177 8.3598C8.96197 8.25 8.78519 8.25 8.43164 8.25"
                                                stroke="#3B3B44"
                                                stroke-width="1.25"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M8.99414 6H9.00089"
                                                stroke="#3B3B44"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`grid w-full gap-4 auto-rows-fr ${
                            isSidebarCollapsed
                                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        }`}
                    >
                        {sortedSettings.map((setting, index) => (
                            <SettingCard
                                key={`setting-${index}`}
                                title={setting.title}
                                description={setting.description}
                                alertCount={setting.alertCount}
                                isEnabled={setting.isEnabled}
                                hasConfigure={setting.hasConfigure}
                                uninstall={setting.uninstall}
                                dropdown={setting.dropdown}
                                optimize={setting.optimize}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

const SettingCard = ({
    title,
    description,
    alertCount,
    isEnabled,
    hasConfigure,
    uninstall,
    dropdown,
    optimize,
}: Omit<SettingCardProps, "category">) => {
    const [enabled, setEnabled] = useState(isEnabled);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("High");
    const [optimizeState, setOptimizeState] = useState<"idle" | "optimizing" | "optimized">("idle");
    const [isOpen, setIsOpen] = useState(false);
    const [customValue, setCustomValue] = useState(0.4);
    const [isEditingCustom, setIsEditingCustom] = useState(false);

    const handleOptimize = async () => {
        if (optimizeState === "idle") {
            setOptimizeState("optimizing");
            // Simulate optimization process
            setTimeout(() => {
                setOptimizeState("optimized");
            }, 2000);
        }
    };

    return (
        <div className="relative">
            <Card className="w-full min-w-[250px] max-w-[350px] h-[184px] bg-[#101019] rounded-xl border border-solid border-[#14141e] overflow-hidden mx-auto">
                <CardContent className="p-0 h-full">
                    <div className="flex flex-col h-full">
                        {/* Title & Description */}
                        <div className="flex flex-col p-5 gap-2 h-[120px]">
                            <h3 className="font-text-lg-leading-7-semibold text-white line-clamp-2 text-sm leading-5 flex items-center gap-2">
                                {title === "Spotify" && (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8.99995 0C4.02952 0 0 4.02951 0 9.00005C0 13.9708 4.02952 18 8.99995 18C13.9709 18 18 13.9708 18 9.00005C18 4.02983 13.971 0 8.99995 0ZM13.1273 12.9807C12.9661 13.245 12.62 13.3289 12.3556 13.1666C10.2425 11.8758 7.5824 11.5835 4.44962 12.2993C4.14774 12.3681 3.84682 12.1789 3.77804 11.8769C3.70893 11.5749 3.89733 11.274 4.19997 11.2052C7.62829 10.4219 10.569 10.7592 12.9413 12.209C13.2057 12.3713 13.2895 12.7163 13.1273 12.9807ZM14.2288 10.53C14.0257 10.8602 13.5937 10.9645 13.2638 10.7613C10.8446 9.27433 7.15693 8.84368 4.29551 9.71228C3.92441 9.82438 3.53247 9.61523 3.41984 9.24477C3.30807 8.87366 3.51731 8.48246 3.88777 8.36961C7.15628 7.37785 11.2197 7.85825 13.9978 9.56547C14.3277 9.7686 14.432 10.2005 14.2288 10.53ZM14.3234 7.97819C11.4228 6.25529 6.63709 6.09687 3.86767 6.93742C3.42295 7.0723 2.95266 6.82124 2.81789 6.37652C2.68312 5.93158 2.93396 5.46159 3.379 5.32639C6.5581 4.36128 11.843 4.54774 15.1825 6.53031C15.5834 6.76772 15.7145 7.28435 15.477 7.68382C15.2406 8.08384 14.7221 8.21571 14.3234 7.97819Z"
                                            fill="#1ED760"
                                        />
                                    </svg>
                                )}
                                {title === "Chrome" && (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clip-path="url(#clip0_1_10229)">
                                            <path
                                                d="M9 13.498C11.4853 13.498 13.5 11.4833 13.5 8.99802C13.5 6.51273 11.4853 4.49802 9 4.49802C6.51472 4.49802 4.5 6.51273 4.5 8.99802C4.5 11.4833 6.51472 13.498 9 13.498Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M9.00006 4.49999H16.793C16.0033 3.13175 14.8673 1.99555 13.4993 1.20561C12.1312 0.415677 10.5792 -0.000140719 8.99946 -3.04957e-05C7.4197 7.97276e-05 5.86781 0.416114 4.49984 1.20624C3.13186 1.99637 1.99603 3.13273 1.20654 4.50107L5.10302 11.25L5.10651 11.2491C4.71013 10.5656 4.50096 9.78962 4.50007 8.99948C4.49918 8.20935 4.70661 7.43294 5.10145 6.74852C5.49628 6.06411 6.06457 5.49588 6.74903 5.10112C7.43349 4.70636 8.20992 4.49901 9.00006 4.49999Z"
                                                fill="url(#paint0_linear_1_10229)"
                                            />
                                            <path
                                                d="M9 12.5625C10.9675 12.5625 12.5625 10.9675 12.5625 9C12.5625 7.03249 10.9675 5.4375 9 5.4375C7.03249 5.4375 5.4375 7.03249 5.4375 9C5.4375 10.9675 7.03249 12.5625 9 12.5625Z"
                                                fill="#1A73E8"
                                            />
                                            <path
                                                d="M12.8966 11.2511L9.00015 18C10.5799 18.0002 12.1319 17.5845 13.5 16.7947C14.8681 16.0048 16.0042 14.8687 16.794 13.5006C17.5838 12.1324 17.9994 10.5804 17.9991 9.00064C17.9988 7.42088 17.5827 5.86904 16.7924 4.50116H8.99947L8.99854 4.50465C9.78867 4.50312 10.5653 4.70993 11.25 5.10423C11.9347 5.49852 12.5034 6.06637 12.8987 6.75052C13.294 7.43466 13.5019 8.21094 13.5016 9.00108C13.5012 9.79122 13.2926 10.5673 12.8966 11.2511Z"
                                                fill="url(#paint1_linear_1_10229)"
                                            />
                                            <path
                                                d="M5.10333 11.2512L1.20685 4.50226C0.416774 5.87026 0.000791301 7.42216 0.000732428 9.00192C0.000673555 10.5817 0.41654 12.1336 1.20652 13.5017C1.99649 14.8697 3.13273 16.0057 4.50099 16.7953C5.86924 17.585 7.42128 18.0005 9.00104 18L12.8975 11.2511L12.895 11.2485C12.5012 11.9336 11.9338 12.5027 11.25 12.8985C10.5662 13.2944 9.79006 13.5029 8.99992 13.5032C8.20978 13.5035 7.43354 13.2954 6.74943 12.9001C6.06533 12.5047 5.49755 11.9359 5.10333 11.2512Z"
                                                fill="url(#paint2_linear_1_10229)"
                                            />
                                        </g>
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_1_10229"
                                                x1="1.20654"
                                                y1="5.62499"
                                                x2="16.793"
                                                y2="5.62499"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stop-color="#D93025" />
                                                <stop offset="1" stop-color="#EA4335" />
                                            </linearGradient>
                                            <linearGradient
                                                id="paint1_linear_1_10229"
                                                x1="7.7706"
                                                y1="17.8797"
                                                x2="15.5638"
                                                y2="4.38138"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stop-color="#FCC934" />
                                                <stop offset="1" stop-color="#FBBC04" />
                                            </linearGradient>
                                            <linearGradient
                                                id="paint2_linear_1_10229"
                                                x1="9.97439"
                                                y1="17.4381"
                                                x2="2.18114"
                                                y2="3.93976"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stop-color="#1E8E3E" />
                                                <stop offset="1" stop-color="#34A853" />
                                            </linearGradient>
                                            <clipPath id="clip0_1_10229">
                                                <rect width="18" height="18" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                )}
                                {title === "Discord" && (
                                    <svg
                                        width="18"
                                        height="14"
                                        viewBox="0 0 18 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15.2477 1.17085C14.0825 0.6257 12.8367 0.229504 11.5342 0.00390625C11.3742 0.293114 11.1873 0.682105 11.0585 0.991546C9.67387 0.78332 8.30201 0.78332 6.94287 0.991546C6.81404 0.682105 6.62292 0.293114 6.46152 0.00390625C5.15761 0.229504 3.91032 0.627156 2.74514 1.17374C0.394982 4.72515 -0.242108 8.18834 0.0764375 11.6024C1.63519 12.7664 3.14581 13.4735 4.63093 13.9362C4.99762 13.4316 5.32465 12.8951 5.60638 12.3297C5.06981 12.1258 4.5559 11.8742 4.07031 11.5821C4.19913 11.4867 4.32514 11.3869 4.44689 11.2842C7.40865 12.6695 10.6267 12.6695 13.5531 11.2842C13.6762 11.3869 13.8022 11.4867 13.9296 11.5821C13.4426 11.8756 12.9273 12.1273 12.3907 12.3312C12.6724 12.8951 12.9981 13.433 13.3662 13.9377C14.8527 13.4749 16.3647 12.7678 17.9235 11.6024C18.2973 7.64464 17.285 4.21325 15.2477 1.17085ZM6.00988 9.50277C5.12079 9.50277 4.39166 8.67275 4.39166 7.66199C4.39166 6.65123 5.10522 5.81977 6.00988 5.81977C6.91457 5.81977 7.64367 6.64977 7.6281 7.66199C7.62951 8.67275 6.91457 9.50277 6.00988 9.50277ZM11.9901 9.50277C11.101 9.50277 10.3718 8.67275 10.3718 7.66199C10.3718 6.65123 11.0854 5.81977 11.9901 5.81977C12.8947 5.81977 13.6238 6.64977 13.6083 7.66199C13.6083 8.67275 12.8947 9.50277 11.9901 9.50277Z"
                                            fill="#5865F2"
                                        />
                                    </svg>
                                )}

                                {title}
                            </h3>
                            <p className="font-text-xs-leading-5-normal text-core-grey400 text-xs leading-4 line-clamp-4 overflow-hidden">
                                {description}
                            </p>
                        </div>

                        {/* Footer Section */}
                        <div className="mt-auto p-5 pt-0 h-[64px] flex flex-col justify-end">
                            <Separator className="mb-4 h-px border-[0.75px] border-dashed border-gray-100/10 bg-transparent" />
                            <div className="flex items-center justify-between w-full">
                                {uninstall ? (
                                    <button className="w-full flex justify-center items-center gap-2 bg-pink-600 hover:bg-red-700 text-white text-xs px-6 py-2 rounded-md transition cursor-pointer">
                                        <span className="text-xs">Uninstall</span>
                                    </button>
                                ) : optimize ? (
                                    <button
                                        onClick={handleOptimize}
                                        disabled={optimizeState === "optimizing"}
                                        className={`w-full flex justify-center items-center gap-2 text-xs px-6 py-2 rounded-md transition cursor-pointer ${
                                            optimizeState === "optimized"
                                                ? "bg-[#282832] text-[#05DF72]"
                                                : optimizeState === "optimizing"
                                                  ? "bg-pink-600 cursor-not-allowed text-[#0A0A14]"
                                                  : "bg-pink-600 hover:bg-red-700 text-[#0A0A14]"
                                        }`}
                                    >
                                        {optimizeState === "optimized" ? (
                                            <>
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                                        fill="#05DF72"
                                                    />
                                                </svg>
                                                <span className="text-xs">Optimized</span>
                                            </>
                                        ) : optimizeState === "optimizing" ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-[#0A0A14] border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-xs">Optimizing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Wrench className="w-4 h-4" />
                                                <span className="text-xs">Optimize</span>
                                            </>
                                        )}
                                    </button>
                                ) : hasConfigure ? (
                                    <div className="w-full flex justify-center">
                                        <button
                                            onClick={() => setIsOpen(true)}
                                            className="flex items-center gap-2 bg-[#1A1A24] hover:bg-pink-600 text-white text-xs px-6 py-2 rounded-md transition cursor-pointer"
                                        >
                                            <SlidersHorizontal className="w-4 h-4" />
                                            <span>Configure</span>
                                        </button>
                                        {isOpen && (
                                            <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50">
                                                {/* Popup Box */}
                                                <div className="w-[380px] h-[488px] bg-[#14141E] text-white p-6 rounded-lg shadow-lg">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h2 className="text-lg font-bold">
                                                            {title}
                                                        </h2>
                                                        <button
                                                            type="button"
                                                            aria-label="Close"
                                                            onClick={() => setIsOpen(false)}
                                                            className="p-1 rounded-md text-[#81818C] hover:text-white hover:bg-[#1A1A24] transition"
                                                        >
                                                            <X className="w-4 h-4 text-[#282832] hover:text-white cursor-pointer" />
                                                        </button>
                                                    </div>
                                                    <p className="mb-4">{description}</p>
                                                    <Separator className="mb-4 h-px border-[0.75px] border-dashed border-gray-100/10 bg-transparent" />
                                                    <p className="mb-3 text-sm">Pre-set Values</p>
                                                    <div className="flex flex-col gap-3 mb-5 w-full">
                                                        <label className="flex items-center justify-between text-sm w-full py-2 cursor-pointer">
                                                            <span className="flex items-center gap-2 text-[#81818C]">
                                                                26 HEX
                                                                <svg
                                                                    width="136"
                                                                    height="24"
                                                                    viewBox="0 0 136 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <rect
                                                                        x="0.375"
                                                                        y="0.375"
                                                                        width="135.25"
                                                                        height="23.25"
                                                                        rx="9.625"
                                                                        fill="#0C0C2B"
                                                                    />
                                                                    <rect
                                                                        x="0.375"
                                                                        y="0.375"
                                                                        width="135.25"
                                                                        height="23.25"
                                                                        rx="9.625"
                                                                        stroke="#6366F1"
                                                                        stroke-width="0.75"
                                                                    />
                                                                    <path
                                                                        d="M11.75 12C14.375 12 17 9.375 17 6.75C17 9.375 19.625 12 22.25 12C19.625 12 17 14.625 17 17.25C17 14.625 14.375 12 11.75 12Z"
                                                                        stroke="#6366F1"
                                                                        stroke-width="1.25"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M11.1667 16.375C11.6529 16.375 12.6251 15.4027 12.6251 14.9166C12.6251 15.4027 13.5973 16.375 14.0834 16.375C13.5973 16.375 12.6251 17.3472 12.6251 17.8333C12.6251 17.3472 11.6529 16.375 11.1667 16.375Z"
                                                                        stroke="#6366F1"
                                                                        stroke-width="1.25"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M19.3333 7.91663C19.9166 7.91663 21.0833 6.74996 21.0833 6.16663C21.0833 6.74996 22.2499 7.91663 22.8333 7.91663C22.2499 7.91663 21.0833 9.08329 21.0833 9.66663C21.0833 9.08329 19.9166 7.91663 19.3333 7.91663Z"
                                                                        stroke="#6366F1"
                                                                        stroke-width="1.25"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M37.328 16L35.336 12.58H34.016V16H32.924V7.636H35.624C36.256 7.636 36.788 7.744 37.22 7.96C37.66 8.176 37.988 8.468 38.204 8.836C38.42 9.204 38.528 9.624 38.528 10.096C38.528 10.672 38.36 11.18 38.024 11.62C37.696 12.06 37.2 12.352 36.536 12.496L38.636 16H37.328ZM34.016 11.704H35.624C36.216 11.704 36.66 11.56 36.956 11.272C37.252 10.976 37.4 10.584 37.4 10.096C37.4 9.6 37.252 9.216 36.956 8.944C36.668 8.672 36.224 8.536 35.624 8.536H34.016V11.704ZM46.2248 12.46C46.2248 12.668 46.2128 12.888 46.1888 13.12H40.9328C40.9728 13.768 41.1928 14.276 41.5928 14.644C42.0008 15.004 42.4928 15.184 43.0688 15.184C43.5408 15.184 43.9328 15.076 44.2448 14.86C44.5648 14.636 44.7888 14.34 44.9168 13.972H46.0928C45.9168 14.604 45.5648 15.12 45.0368 15.52C44.5088 15.912 43.8528 16.108 43.0688 16.108C42.4448 16.108 41.8848 15.968 41.3888 15.688C40.9008 15.408 40.5168 15.012 40.2368 14.5C39.9568 13.98 39.8168 13.38 39.8168 12.7C39.8168 12.02 39.9528 11.424 40.2248 10.912C40.4968 10.4 40.8768 10.008 41.3648 9.736C41.8608 9.456 42.4288 9.316 43.0688 9.316C43.6928 9.316 44.2448 9.452 44.7248 9.724C45.2048 9.996 45.5728 10.372 45.8288 10.852C46.0928 11.324 46.2248 11.86 46.2248 12.46ZM45.0968 12.232C45.0968 11.816 45.0048 11.46 44.8208 11.164C44.6368 10.86 44.3848 10.632 44.0648 10.48C43.7528 10.32 43.4048 10.24 43.0208 10.24C42.4688 10.24 41.9968 10.416 41.6048 10.768C41.2208 11.12 41.0008 11.608 40.9448 12.232H45.0968ZM47.2582 12.7C47.2582 12.02 47.3942 11.428 47.6662 10.924C47.9382 10.412 48.3142 10.016 48.7942 9.736C49.2822 9.456 49.8382 9.316 50.4622 9.316C51.2702 9.316 51.9342 9.512 52.4542 9.904C52.9822 10.296 53.3302 10.84 53.4982 11.536H52.3222C52.2102 11.136 51.9902 10.82 51.6622 10.588C51.3422 10.356 50.9422 10.24 50.4622 10.24C49.8382 10.24 49.3342 10.456 48.9502 10.888C48.5662 11.312 48.3742 11.916 48.3742 12.7C48.3742 13.492 48.5662 14.104 48.9502 14.536C49.3342 14.968 49.8382 15.184 50.4622 15.184C50.9422 15.184 51.3422 15.072 51.6622 14.848C51.9822 14.624 52.2022 14.304 52.3222 13.888H53.4982C53.3222 14.56 52.9702 15.1 52.4422 15.508C51.9142 15.908 51.2542 16.108 50.4622 16.108C49.8382 16.108 49.2822 15.968 48.7942 15.688C48.3142 15.408 47.9382 15.012 47.6662 14.5C47.3942 13.988 47.2582 13.388 47.2582 12.7ZM57.8233 16.108C57.2073 16.108 56.6473 15.968 56.1433 15.688C55.6473 15.408 55.2553 15.012 54.9673 14.5C54.6873 13.98 54.5473 13.38 54.5473 12.7C54.5473 12.028 54.6913 11.436 54.9793 10.924C55.2753 10.404 55.6753 10.008 56.1793 9.736C56.6833 9.456 57.2473 9.316 57.8713 9.316C58.4953 9.316 59.0593 9.456 59.5633 9.736C60.0673 10.008 60.4633 10.4 60.7513 10.912C61.0473 11.424 61.1953 12.02 61.1953 12.7C61.1953 13.38 61.0433 13.98 60.7393 14.5C60.4433 15.012 60.0393 15.408 59.5273 15.688C59.0153 15.968 58.4473 16.108 57.8233 16.108ZM57.8233 15.148C58.2153 15.148 58.5833 15.056 58.9273 14.872C59.2713 14.688 59.5473 14.412 59.7553 14.044C59.9713 13.676 60.0793 13.228 60.0793 12.7C60.0793 12.172 59.9753 11.724 59.7673 11.356C59.5593 10.988 59.2873 10.716 58.9513 10.54C58.6153 10.356 58.2513 10.264 57.8593 10.264C57.4593 10.264 57.0913 10.356 56.7553 10.54C56.4273 10.716 56.1633 10.988 55.9633 11.356C55.7633 11.724 55.6633 12.172 55.6633 12.7C55.6633 13.236 55.7593 13.688 55.9513 14.056C56.1513 14.424 56.4153 14.7 56.7433 14.884C57.0713 15.06 57.4313 15.148 57.8233 15.148ZM70.539 9.304C71.051 9.304 71.507 9.412 71.907 9.628C72.307 9.836 72.623 10.152 72.855 10.576C73.087 11 73.203 11.516 73.203 12.124V16H72.123V12.28C72.123 11.624 71.959 11.124 71.631 10.78C71.311 10.428 70.875 10.252 70.323 10.252C69.755 10.252 69.303 10.436 68.967 10.804C68.631 11.164 68.463 11.688 68.463 12.376V16H67.383V12.28C67.383 11.624 67.219 11.124 66.891 10.78C66.571 10.428 66.135 10.252 65.583 10.252C65.015 10.252 64.563 10.436 64.227 10.804C63.891 11.164 63.723 11.688 63.723 12.376V16H62.631V9.424H63.723V10.372C63.939 10.028 64.227 9.764 64.587 9.58C64.955 9.396 65.359 9.304 65.799 9.304C66.351 9.304 66.839 9.428 67.263 9.676C67.687 9.924 68.003 10.288 68.211 10.768C68.395 10.304 68.699 9.944 69.123 9.688C69.547 9.432 70.019 9.304 70.539 9.304ZM82.9023 9.304C83.4143 9.304 83.8703 9.412 84.2703 9.628C84.6703 9.836 84.9863 10.152 85.2183 10.576C85.4503 11 85.5663 11.516 85.5663 12.124V16H84.4863V12.28C84.4863 11.624 84.3223 11.124 83.9943 10.78C83.6743 10.428 83.2383 10.252 82.6863 10.252C82.1183 10.252 81.6663 10.436 81.3303 10.804C80.9943 11.164 80.8263 11.688 80.8263 12.376V16H79.7463V12.28C79.7463 11.624 79.5823 11.124 79.2543 10.78C78.9343 10.428 78.4983 10.252 77.9463 10.252C77.3783 10.252 76.9263 10.436 76.5903 10.804C76.2543 11.164 76.0863 11.688 76.0863 12.376V16H74.9943V9.424H76.0863V10.372C76.3023 10.028 76.5903 9.764 76.9503 9.58C77.3183 9.396 77.7223 9.304 78.1623 9.304C78.7143 9.304 79.2023 9.428 79.6263 9.676C80.0503 9.924 80.3663 10.288 80.5743 10.768C80.7583 10.304 81.0623 9.944 81.4863 9.688C81.9103 9.432 82.3823 9.304 82.9023 9.304ZM93.3576 12.46C93.3576 12.668 93.3456 12.888 93.3216 13.12H88.0656C88.1056 13.768 88.3256 14.276 88.7256 14.644C89.1336 15.004 89.6256 15.184 90.2016 15.184C90.6736 15.184 91.0656 15.076 91.3776 14.86C91.6976 14.636 91.9216 14.34 92.0496 13.972H93.2256C93.0496 14.604 92.6976 15.12 92.1696 15.52C91.6416 15.912 90.9856 16.108 90.2016 16.108C89.5776 16.108 89.0176 15.968 88.5216 15.688C88.0336 15.408 87.6496 15.012 87.3696 14.5C87.0896 13.98 86.9496 13.38 86.9496 12.7C86.9496 12.02 87.0856 11.424 87.3576 10.912C87.6296 10.4 88.0096 10.008 88.4976 9.736C88.9936 9.456 89.5616 9.316 90.2016 9.316C90.8256 9.316 91.3776 9.452 91.8576 9.724C92.3376 9.996 92.7056 10.372 92.9616 10.852C93.2256 11.324 93.3576 11.86 93.3576 12.46ZM92.2296 12.232C92.2296 11.816 92.1376 11.46 91.9536 11.164C91.7696 10.86 91.5176 10.632 91.1976 10.48C90.8856 10.32 90.5376 10.24 90.1536 10.24C89.6016 10.24 89.1296 10.416 88.7376 10.768C88.3536 11.12 88.1336 11.608 88.0776 12.232H92.2296ZM98.003 9.304C98.803 9.304 99.451 9.548 99.947 10.036C100.443 10.516 100.691 11.212 100.691 12.124V16H99.611V12.28C99.611 11.624 99.447 11.124 99.119 10.78C98.791 10.428 98.343 10.252 97.775 10.252C97.199 10.252 96.739 10.432 96.395 10.792C96.059 11.152 95.891 11.676 95.891 12.364V16H94.799V9.424H95.891V10.36C96.107 10.024 96.399 9.764 96.767 9.58C97.143 9.396 97.555 9.304 98.003 9.304ZM102.067 12.688C102.067 12.016 102.203 11.428 102.475 10.924C102.747 10.412 103.119 10.016 103.591 9.736C104.071 9.456 104.607 9.316 105.199 9.316C105.711 9.316 106.187 9.436 106.627 9.676C107.067 9.908 107.403 10.216 107.635 10.6V7.12H108.739V16H107.635V14.764C107.419 15.156 107.099 15.48 106.675 15.736C106.251 15.984 105.755 16.108 105.187 16.108C104.603 16.108 104.071 15.964 103.591 15.676C103.119 15.388 102.747 14.984 102.475 14.464C102.203 13.944 102.067 13.352 102.067 12.688ZM107.635 12.7C107.635 12.204 107.535 11.772 107.335 11.404C107.135 11.036 106.863 10.756 106.519 10.564C106.183 10.364 105.811 10.264 105.403 10.264C104.995 10.264 104.623 10.36 104.287 10.552C103.951 10.744 103.683 11.024 103.483 11.392C103.283 11.76 103.183 12.192 103.183 12.688C103.183 13.192 103.283 13.632 103.483 14.008C103.683 14.376 103.951 14.66 104.287 14.86C104.623 15.052 104.995 15.148 105.403 15.148C105.811 15.148 106.183 15.052 106.519 14.86C106.863 14.66 107.135 14.376 107.335 14.008C107.535 13.632 107.635 13.196 107.635 12.7ZM116.584 12.46C116.584 12.668 116.572 12.888 116.548 13.12H111.292C111.332 13.768 111.552 14.276 111.952 14.644C112.36 15.004 112.852 15.184 113.428 15.184C113.9 15.184 114.292 15.076 114.604 14.86C114.924 14.636 115.148 14.34 115.276 13.972H116.452C116.276 14.604 115.924 15.12 115.396 15.52C114.868 15.912 114.212 16.108 113.428 16.108C112.804 16.108 112.244 15.968 111.748 15.688C111.26 15.408 110.876 15.012 110.596 14.5C110.316 13.98 110.176 13.38 110.176 12.7C110.176 12.02 110.312 11.424 110.584 10.912C110.856 10.4 111.236 10.008 111.724 9.736C112.22 9.456 112.788 9.316 113.428 9.316C114.052 9.316 114.604 9.452 115.084 9.724C115.564 9.996 115.932 10.372 116.188 10.852C116.452 11.324 116.584 11.86 116.584 12.46ZM115.456 12.232C115.456 11.816 115.364 11.46 115.18 11.164C114.996 10.86 114.744 10.632 114.424 10.48C114.112 10.32 113.764 10.24 113.38 10.24C112.828 10.24 112.356 10.416 111.964 10.768C111.58 11.12 111.36 11.608 111.304 12.232H115.456ZM117.618 12.688C117.618 12.016 117.754 11.428 118.026 10.924C118.298 10.412 118.67 10.016 119.142 9.736C119.622 9.456 120.158 9.316 120.75 9.316C121.262 9.316 121.738 9.436 122.178 9.676C122.618 9.908 122.954 10.216 123.186 10.6V7.12H124.29V16H123.186V14.764C122.97 15.156 122.65 15.48 122.226 15.736C121.802 15.984 121.306 16.108 120.738 16.108C120.154 16.108 119.622 15.964 119.142 15.676C118.67 15.388 118.298 14.984 118.026 14.464C117.754 13.944 117.618 13.352 117.618 12.688ZM123.186 12.7C123.186 12.204 123.086 11.772 122.886 11.404C122.686 11.036 122.414 10.756 122.07 10.564C121.734 10.364 121.362 10.264 120.954 10.264C120.546 10.264 120.174 10.36 119.838 10.552C119.502 10.744 119.234 11.024 119.034 11.392C118.834 11.76 118.734 12.192 118.734 12.688C118.734 13.192 118.834 13.632 119.034 14.008C119.234 14.376 119.502 14.66 119.838 14.86C120.174 15.052 120.546 15.148 120.954 15.148C121.362 15.148 121.734 15.052 122.07 14.86C122.414 14.66 122.686 14.376 122.886 14.008C123.086 13.632 123.186 13.196 123.186 12.7Z"
                                                                        fill="#6366F1"
                                                                    />
                                                                </svg>
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 appearance-none rounded-full border border-gray-400 bg-transparent checked:bg-pink-600 checked:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 cursor-pointer"
                                                            />
                                                        </label>

                                                        <label className="flex items-center justify-between text-sm w-full py-2 cursor-pointer text-[#81818C]">
                                                            <span>24 HEX</span>
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 appearance-none rounded-full border border-gray-400 bg-transparent checked:bg-pink-600 checked:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 cursor-pointer"
                                                            />
                                                        </label>

                                                        <label className="flex items-center justify-between text-sm w-full py-2 cursor-pointer text-[#81818C]">
                                                            <span>2A HEX</span>
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 appearance-none rounded-full border border-gray-400 bg-transparent checked:bg-pink-600 checked:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 cursor-pointer"
                                                            />
                                                        </label>
                                                    </div>

                                                    <Separator className="mb-4 h-px border-[0.75px] border-dashed border-gray-100/10 bg-transparent" />

                                                    <p className="mb-2">Custom</p>

                                                    {isEditingCustom ? (
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={1}
                                                            step={0.01}
                                                            autoFocus
                                                            value={
                                                                Number.isFinite(customValue)
                                                                    ? customValue
                                                                    : 0
                                                            }
                                                            onChange={(e) => {
                                                                const v = parseFloat(
                                                                    e.target.value,
                                                                );
                                                                if (Number.isFinite(v))
                                                                    setCustomValue(
                                                                        Math.min(1, Math.max(0, v)),
                                                                    );
                                                            }}
                                                            onBlur={() => setIsEditingCustom(false)}
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key === "Enter" ||
                                                                    e.key === "Escape"
                                                                )
                                                                    setIsEditingCustom(false);
                                                            }}
                                                            className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <Slider
                                                                aria-label="Custom value"
                                                                className="flex-1
                                          [&_[data-slot=track]]:h-1
                                          [&_[data-slot=filler]]:h-1
                                          [&_[data-slot=track]]:bg-[#1A1A24]
                                          [&_[data-slot=filler]]:bg-purple-500
                                          [&_[data-slot=thumb]]:w-4
                                          [&_[data-slot=thumb]]:h-4
                                          [&_[data-slot=thumb]]:bg-white
                                          [&_[data-slot=thumb]]:border-2
                                          [&_[data-slot=thumb]]:border-white
                                          [&_[data-slot=thumb]]:z-10
                                          cursor-pointer"
                                                                value={customValue}
                                                                onChange={(val) =>
                                                                    setCustomValue(
                                                                        Array.isArray(val)
                                                                            ? val[0]
                                                                            : val,
                                                                    )
                                                                }
                                                                maxValue={1}
                                                                minValue={0}
                                                                size="md"
                                                                step={0.01}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setIsEditingCustom(true)
                                                                }
                                                                className="text-xs px-3 py-1 rounded-md border border-gray-600 bg-[#1A1A24] hover:bg-[#222231] transition"
                                                                title="Click to enter a value"
                                                            >
                                                                [{customValue.toFixed(2)}]
                                                            </button>
                                                        </div>
                                                    )}
                                                    {/* Actions */}
                                                    <div className="flex justify-center gap-3 mt-4">
                                                        <button
                                                            onClick={() => setIsOpen(false)}
                                                            className="px-4 py-2 bg-pink-600 rounded-lg hover:bg-gray-400 w-full text-[#0A0A14] text-sm cursor-pointer"
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Icon + Alert Count Group */}
                                        <div className="relative group flex items-center gap-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <TriangleAlertIcon
                                                    className={`w-4 h-4 ${alertCount > 0 ? "text-pink-600" : "text-core-grey400"}`}
                                                />
                                                <span
                                                    className={`text-xs ${alertCount > 0 ? "text-pink-600" : "text-core-grey400"}`}
                                                >
                                                    {alertCount}
                                                </span>
                                            </div>

                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-6 py-2 text-xs bg-gray-800 rounded-[12px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-[220px] text-center -translate-x-[50px]">
                                                {alertCount > 0 ? (
                                                    <div className="flex items-center justify-center gap-2 text-xs pl-4">
                                                        <TriangleAlertIcon className="w-4 h-4 text-pink-600 flex-shrink-0" />
                                                        <span className="text-pink-600 font-medium whitespace-norape">
                                                            May increase system temperatures
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2 text-xs pl-4">
                                                        <CircleCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        <span className="text-white font-medium">
                                                            No warnings
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                            </div>
                                        </div>

                                        {/* Switch or Dropdown */}
                                        {dropdown ? (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                                    className="flex items-center gap-2 bg-[#1A1A24] hover:bg-pink-600 text-white text-xs px-4 py-2 rounded-md transition cursor-pointer"
                                                >
                                                    <span>{selectedOption}</span>
                                                    <ChevronDown
                                                        className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                                                    />
                                                </button>
                                            </div>
                                        ) : (
                                            <Switch
                                                checked={enabled}
                                                onCheckedChange={() => setEnabled(!enabled)}
                                                className="data-[state=checked]:bg-pink-500 data-[state=unchecked]:bg-gray-600 data-[state=unchecked]:border-grey-650"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dropdown positioned outside the card */}
            {dropdown && dropdownOpen && (
                <div className="absolute bottom-0 right-0 mb-2 w-32 bg-[#1A1A24] border border-[#14141e] rounded-md shadow-lg z-[9999]">
                    <div
                        onClick={() => {
                            setSelectedOption("High");
                            setDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-xs cursor-pointer transition ${
                            selectedOption === "High"
                                ? "text-pink-600 bg-[#1A1A24]"
                                : "text-white hover:bg-pink-600"
                        }`}
                    >
                        High
                    </div>
                    <div
                        onClick={() => {
                            setSelectedOption("Medium");
                            setDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-xs cursor-pointer transition ${
                            selectedOption === "Medium"
                                ? "text-pink-600 bg-pink-600/10"
                                : "text-white hover:bg-pink-600"
                        }`}
                    >
                        Medium
                    </div>
                    <div
                        onClick={() => {
                            setSelectedOption("Low");
                            setDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-xs cursor-pointer transition ${
                            selectedOption === "Low"
                                ? "text-pink-600 bg-pink-600/10"
                                : "text-white hover:bg-pink-600"
                        }`}
                    >
                        Low
                    </div>
                </div>
            )}
        </div>
    );
};
