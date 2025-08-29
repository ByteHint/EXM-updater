import { useState } from "react";
import {
    TriangleAlertIcon,
    SlidersHorizontal,
    ChevronDown,
    Wrench,
    X,
    Gamepad2,
    Zap,
    Target,
    Crown,
    Trophy,
    Crosshair,
    Rocket,
    Music,
    Chrome,
    MessageSquare,
    Monitor,
    BrushCleaning,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";
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
    actionType?: "clear-temp";
}

interface SettingsSectionProps {
    activeCategory?: string;
    searchQuery?: string;
    filterState?: "all" | "enabled" | "disabled" | "alerts";
    sortState?: "name" | "alerts" | "status";
    sortDirection?: "asc" | "desc";
    isSidebarCollapsed?: boolean;
}

interface GameIconProps {
    gameName: string;
    size?: number;
    className?: string;
}

interface AppIconProps {
    appName: string;
    size?: number;
    className?: string;
}

interface SettingCardComponentProps extends SettingCardProps {
    isSidebarCollapsed?: boolean;
}

interface DebloatCardProps {
    title: string;
    hasClean?: boolean;
    size?: string;
}
const GameIcon = ({ gameName, size = 52, className = "" }: GameIconProps) => {
    const iconProps = {
        width: size,
        height: size,
        className: `text-white ${className}`,
    };

    switch (gameName.toLowerCase()) {
        case "valorant":
            return <Target {...iconProps} />;
        case "splitgate":
            return <Zap {...iconProps} />;
        case "fortnite":
            return <Crown {...iconProps} />;
        case "the finals":
            return <Trophy {...iconProps} />;
        case "counter-strike 2":
            return <Crosshair {...iconProps} />;
        case "apex legends":
            return <Rocket {...iconProps} />;
        default:
            return <Gamepad2 {...iconProps} />;
    }
};

const AppIcon = ({ appName, size = 52, className = "" }: AppIconProps) => {
    const iconProps = {
        width: size,
        height: size,
        className: `text-white ${className}`,
    };

    switch (appName.toLowerCase()) {
        case "spotify":
            return <Music {...iconProps} />;
        case "chrome":
            return <Chrome {...iconProps} />;
        case "discord":
            return <MessageSquare {...iconProps} />;
        default:
            return <Monitor {...iconProps} />;
    }
};

const SettingCard = ({
    title,
    description,
    alertCount,
    isEnabled,
    category,
    hasConfigure = false,
    uninstall = false,
    dropdown = false,
    optimize = false,
    actionType,
    isSidebarCollapsed = false,
}: SettingCardComponentProps) => {
    const [enabled, setEnabled] = useState(isEnabled);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("High");
    const [isConfiguring, setIsConfiguring] = useState(false);
    const [sliderValue, setSliderValue] = useState([50]);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionSuccess, setActionSuccess] = useState(false);

    const handleActionClick = async () => {
        if (actionType === "clear-temp") {
            setActionLoading(true);
            const minRunningMs = 5000;
            const start = Date.now();
            try {
                await window.api.invoke("clear-temp-files");
            } catch (e) {
                console.error("Clear temp files failed:", e);
            } finally {
                const elapsed = Date.now() - start;
                if (elapsed < minRunningMs) {
                    await new Promise((resolve) => setTimeout(resolve, minRunningMs - elapsed));
                }
                setActionLoading(false);
                setActionSuccess(true);
            }
        }
    };

    const renderIcon = () => {
        if (category === "games") {
            return <GameIcon gameName={title} size={52} />;
        }
        if (category === "apps") {
            return <AppIcon appName={title} size={52} />;
        }
        return null;
    };

    return (
        <div className="relative">
            <Card className="bg-[#0F0F17] border-[#14141e] hover:border-pink-600/50 transition-colors duration-200 h-full">
                <CardContent className="h-full flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                {renderIcon()}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-medium text-sm leading-tight mb-1 line-clamp-2">
                                        {title}
                                    </h3>
                                    {alertCount > 0 && (
                                        <div className="flex items-center gap-1">
                                            <TriangleAlertIcon className="w-3 h-3 text-orange-500" />
                                            <span className="text-orange-500 text-xs">
                                                {alertCount} alert{alertCount !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-2">
                                {hasConfigure && (
                                    <button
                                        onClick={() => setIsConfiguring(!isConfiguring)}
                                        className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 transition-colors flex-shrink-0"
                                        aria-label="Configure"
                                    >
                                        <Wrench className="w-3 h-3 text-white" />
                                    </button>
                                )}

                                {uninstall && (
                                    <button className="p-1.5 rounded bg-red-600 hover:bg-red-500 transition-colors flex-shrink-0">
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                )}

                                {dropdown && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                                        >
                                            <span className="text-white">{selectedOption}</span>
                                            <ChevronDown className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                )}

                                {optimize && (
                                    <button className="px-2 py-1 text-xs bg-pink-600 hover:bg-pink-500 text-white rounded transition-colors flex-shrink-0">
                                        Optimize
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3">
                            {description}
                        </p>

                        {isConfiguring && (
                            <div className="mb-4 p-3 bg-[#1A1A24] rounded border border-[#14141e]">
                                <label className="block text-white text-xs mb-2">
                                    Configuration Value: {sliderValue[0]}
                                </label>
                                <Slider
                                    value={sliderValue}
                                    onChange={(value) =>
                                        setSliderValue(Array.isArray(value) ? value : [value])
                                    }
                                    maxValue={100}
                                    minValue={0}
                                    step={1}
                                    className="w-full"
                                    classNames={{
                                        track: "bg-gray-600",
                                        filler: "bg-pink-500",
                                        thumb: "bg-pink-500 border-pink-400",
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {!isSidebarCollapsed && (
                                <span className="text-gray-400 text-xs">
                                    {enabled ? "Enabled" : "Disabled"}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {actionType ? (
                                <button
                                    onClick={handleActionClick}
                                    disabled={actionLoading}
                                    className="px-3 py-1 text-xs bg-pink-600 hover:bg-pink-500 disabled:opacity-70 text-white rounded transition-colors"
                                >
                                    {actionLoading
                                        ? "Clearing..."
                                        : actionSuccess
                                          ? "Done!"
                                          : "Clear Temp Files"}
                                </button>
                            ) : (
                                <>
                                    {!optimize ? (
                                        <>
                                            {uninstall ? (
                                                <div className="flex items-center gap-2">
                                                    <button className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded transition-colors">
                                                        Uninstall
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
                                    ) : null}
                                </>
                            )}
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

const allSettingsData: SettingCardProps[] = [
    // Maintenance Utilities
    {
        title: "Clear Temporary Files",
        description:
            "Frees up disk space by removing files in the system temporary directory. Safe to run.",
        alertCount: 0,
        isEnabled: true,
        category: "core",
        actionType: "clear-temp",
    },
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
        description: "Increase mouse responsiveness and accuracy by prioritizing essential system",
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
        description: "Disables User Account Control to reduce interruptions and improve workflow.",
        alertCount: 3,
        isEnabled: false,
        category: "security",
    },
    {
        title: "Windows Firewall",
        description: "Configures firewall settings for optimal gaming and application performance.",
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
            "Spotify is a digital music service that gives you access to millions of songs.",
        alertCount: 0,
        isEnabled: true,
        uninstall: true,
        category: "apps",
    },
    {
        title: "Chrome",
        description: "Google Chrome is a web browser developed by Google.",
        alertCount: 3,
        isEnabled: false,
        uninstall: true,
        category: "apps",
    },
    {
        title: "Discord",
        description: "Discord is a voice, video, and text communication app.",
        alertCount: 0,
        isEnabled: true,
        uninstall: true,
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
        description: "Reduce input lag and screen tearing by disabling vertical synchronization.",
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
        title: "Custom NVIDIA driver",
        description: "Increase mouse responsiveness and accuracy by prioritizing essential system",
        alertCount: 0,
        isEnabled: true,
        hasConfigure: true,
        category: "monitor",
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
        description: "Enable flicker-free mode for better visual comfort and reduced eye strain.",
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

// Debloat helpers and UI
const isDebloatCategory = (cat: string) => ["clean", "services", "apps", "autorun"].includes(cat);

const DebloatCard = ({ title, hasClean = false, size }: DebloatCardProps) => {
    const [actionLoading, setActionLoading] = useState(false);
    const [actionSuccess, setActionSuccess] = useState(false);

    const handleClean = async () => {
        setActionLoading(true);
        const minRunningMs = 5000;
        const start = Date.now();
        try {
            await window.api.invoke?.("debloat-action", { action: "clean", title });
        } catch (e) {
            console.error("Debloat action failed:", e);
        } finally {
            const elapsed = Date.now() - start;
            if (elapsed < minRunningMs) {
                await new Promise((resolve) => setTimeout(resolve, minRunningMs - elapsed));
            }
            setActionLoading(false);
            setActionSuccess(true);
        }
    };

    return (
        <Card className="bg-[#0F0F17] border-[#14141e] hover:border-pink-600/50 transition-colors duration-200 h-full">
            <CardContent className="h-full flex items-center justify-between">
                <h3 className="text-white font-medium text-sm leading-tight">{title}</h3>
                <div className="flex items-center gap-3">
                    {size && <span className="text-xs text-core-grey400">{size}</span>}
                    {hasClean && (
                        <button
                            onClick={handleClean}
                            disabled={actionLoading}
                            className="px-3 py-1 text-xs bg-[#1A1A24] hover:bg-pink-500 disabled:opacity-70 text-white rounded transition-colors flex items-center gap-1.5"
                        >
                            <BrushCleaning className="w-3.5 h-3.5" />
                            {actionLoading ? "Running..." : actionSuccess ? "Done!" : "Clean"}
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const debloatData: Record<string, DebloatCardProps[]> = {
    clean: [
        { title: "Temporary files", hasClean: true, size: "240.57 MB" },
        { title: "Thumbnail cache", hasClean: true, size: "240.57 MB" },
        { title: "Windows Defender files", hasClean: true, size: "240.57 MB" },
        { title: "System error files", hasClean: true, size: "240.57 MB" },
        { title: "Old ChkDsk files", hasClean: true, size: "240.57 MB" },
        { title: "DirectX Shader Cache", hasClean: true, size: "240.57 MB" },
    ],
    services: [
        { title: "Disable Telemetry" },
        { title: "Disable Cortana" },
        { title: "Disable DiagTrack" },
    ],
    autorun: [{ title: "Disable Startup Apps" }, { title: "Disable Game Bar Startup" }],
};

export const SettingsSection = ({
    activeCategory = "core",
    searchQuery = "",
    filterState = "all",
    sortState = "name",
    sortDirection = "asc",
    isSidebarCollapsed = false,
}: SettingsSectionProps) => {
    const parseSizeToBytes = (size?: string): number => {
        if (!size) return 0;
        const match = size.match(/([0-9]+\.?[0-9]*)\s*(KB|MB|GB)/i);
        if (!match) return 0;
        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        const unitMap: Record<string, number> = { KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
        return Math.round(value * (unitMap[unit] || 1));
    };

    const formatBytes = (bytes: number): string => {
        if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
        if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
        if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${bytes} B`;
    };

    const totalCleanBytes = (debloatData.clean || []).reduce(
        (sum, i) => sum + parseSizeToBytes(i.size),
        0,
    );
    const totalCleanLabel = totalCleanBytes ? `${formatBytes(totalCleanBytes)} Total` : "";
    const [cleanOpen, setCleanOpen] = useState(true);
    // Filter settings based on active category, search query, and filter state
    const filteredSettings = allSettingsData.filter((setting) => {
        const matchesCategory = activeCategory === "all" || setting.category === activeCategory;
        const matchesSearch =
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
                break;
        }

        return sortDirection === "desc" ? -compareValue : compareValue;
    });

    return (
        <div className="flex-1 overflow-y-auto">
            {isDebloatCategory(activeCategory) ? (
                <>
                    {activeCategory === "clean" && (
                        <button
                            onClick={() => setCleanOpen(!cleanOpen)}
                            className="flex items-center justify-between w-full mb-3 rounded-[10px] border border-[#1e1e28] bg-core-grey800 px-3 py-2"
                        >
                            <div className="flex items-center gap-2">
                                <div className="text-sm text-semibold text-white">Files</div>
                                <span className="text-xs text-[#4F4F55] pt-0.5">
                                    {totalCleanLabel}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <ChevronDown
                                    className={`w-4 h-4 text-white transition-transform ${cleanOpen ? "rotate-180" : ""}`}
                                />
                            </div>
                        </button>
                    )}

                    <div className="flex flex-col gap-2">
                        {(debloatData[activeCategory] ?? [])
                            .filter((_) => (activeCategory === "clean" ? cleanOpen : true))
                            .map((item, index) => (
                                <DebloatCard key={`${item.title}-${index}`} {...item} />
                            ))}
                    </div>

                    {(debloatData[activeCategory] ?? []).length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <SlidersHorizontal className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">
                                No debloat items found
                            </h3>
                            <p className="text-gray-400">
                                Try switching tabs or check your configuration
                            </p>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedSettings.map((setting, index) => (
                            <SettingCard
                                key={`${setting.title}-${index}`}
                                {...setting}
                                isSidebarCollapsed={isSidebarCollapsed}
                            />
                        ))}
                    </div>

                    {/* Empty state */}
                    {sortedSettings.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <SlidersHorizontal className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">
                                No settings found
                            </h3>
                            <p className="text-gray-400">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
