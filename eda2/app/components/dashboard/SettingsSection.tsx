import { AlertCircleIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

interface SettingCardProps {
    title: string;
    description: string;
    alertCount: number;
    isEnabled: boolean;
    category: string;
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
            title: "High Performance Mode",
            description:
                "Sets the power plan to high performance for maximum CPU and GPU performance.",
            alertCount: 0,
            isEnabled: true,
            category: "power",
        },
        {
            title: "Disable USB Power Saving",
            description:
                "Prevents USB devices from entering power saving mode that can cause disconnections.",
            alertCount: 1,
            isEnabled: false,
            category: "power",
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
            title: "Microsoft Store Apps",
            description: "Removes or disables unnecessary Microsoft Store applications.",
            alertCount: 8,
            isEnabled: true,
            category: "apps",
        },
        {
            title: "Background Apps",
            description: "Controls which apps can run in the background to save resources.",
            alertCount: 3,
            isEnabled: true,
            category: "apps",
        },
        {
            title: "Default Apps Settings",
            description: "Configures default applications for various file types and protocols.",
            alertCount: 0,
            isEnabled: false,
            category: "apps",
        },

        // Games Settings
        {
            title: "Game Mode",
            description: "Enables Windows Game Mode for improved gaming performance.",
            alertCount: 0,
            isEnabled: true,
            category: "games",
        },
        {
            title: "GPU Scheduling",
            description:
                "Enables hardware-accelerated GPU scheduling for better graphics performance.",
            alertCount: 1,
            isEnabled: true,
            category: "games",
        },
        {
            title: "Fullscreen Optimizations",
            description:
                "Disables fullscreen optimizations that can cause input lag and stuttering.",
            alertCount: 0,
            isEnabled: true,
            category: "games",
        },
    ];

    // Filter settings based on active category, search query, and filter state
    const filteredSettings = allSettingsData.filter((setting) => {
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

    return (
        <section className="flex flex-col w-full items-start gap-3.5 pb-6">
            <div className="flex flex-col w-full items-start gap-4 relative">
                {sortedSettings.length === 0 ? (
                    <div className="w-full text-center py-8">
                        <p className="text-core-grey400 text-sm">
                            {searchQuery
                                ? `No settings found for "${searchQuery}"`
                                : `No settings available for ${activeCategory}`}
                        </p>
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
}: Omit<SettingCardProps, "category">) => {
    return (
        <Card className="w-full min-w-[250px] max-w-[350px] h-[184px] bg-[#101019] rounded-xl border border-solid border-[#14141e] overflow-hidden mx-auto">
            <CardContent className="p-0 h-full">
                <div className="flex flex-col h-full">
                    <div className="flex flex-col p-5 gap-2 h-[120px]">
                        <h3 className="font-text-lg-leading-7-semibold text-white line-clamp-2 text-sm leading-5">
                            {title}
                        </h3>
                        <p className="font-text-xs-leading-5-normal text-core-grey400 text-xs leading-4 line-clamp-4 overflow-hidden">
                            {description}
                        </p>
                    </div>

                    <div className="mt-auto p-5 pt-0 h-[64px] flex flex-col justify-end">
                        <Separator className="mb-4 h-px border-[0.75px] border-dashed border-gray-100/10 bg-transparent" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <AlertCircleIcon className="w-4 h-4" />
                                <span
                                    className={`text-xs ${alertCount > 0 ? "text-rift-magenta500" : "text-core-grey400"}`}
                                >
                                    {alertCount}
                                </span>
                            </div>

                            <Switch
                                checked={isEnabled}
                                className="data-[state=checked]:bg-pink-500 data-[state=unchecked]:bg-gray-600 data-[state=unchecked]:border-grey-650"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
