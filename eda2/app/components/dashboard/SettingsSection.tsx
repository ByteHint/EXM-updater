import { AlertCircleIcon, TriangleAlertIcon, SlidersHorizontal, CircleCheck, ChevronDown, Wrench } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { useState } from "react";

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
      description: "Spotify is a digital music service that gives you access to millions of songs.",
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
      title: "Game Mode",
      description: "Enables Windows Game Mode for improved gaming performance.",
      alertCount: 0,
      isEnabled: true,
      category: "games",
    },
    {
      title: "GPU Scheduling",
      description: "Enables hardware-accelerated GPU scheduling for better graphics performance.",
      alertCount: 1,
      isEnabled: true,
      category: "games",
    },
    {
      title: "Fullscreen Optimizations",
      description: "Disables fullscreen optimizations that can cause input lag and stuttering.",
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
      description: "Boost CPU clock speed dynamically for enhanced performance during heavy loads.",
      alertCount: 2,
      isEnabled: true,
      category: "cpu",
    },
    {
      title: "Disable Background Animations",
      description: "Turn off visual effects to reduce CPU load and improve system responsiveness.",
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
      description: "Force the GPU to run at maximum performance level for consistent frame rates.",
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
      title: "Enable Adaptive Refresh Rate",
      description: "Reduce screen tearing by syncing refresh rate with frame output dynamically.",
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
      description: "Enable flicker-free mode for better visual comfort and reduced eye strain.",
      alertCount: 0,
      isEnabled: true,
      category: "monitor",
    },

    // Peripherals Settings
    {
      title: "Adjust Mouse Polling Rate",
      description: "Increase mouse responsiveness and accuracy for gaming and productivity tasks.",
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

    /*
    // Apps debloat Settings
    {
      title: "Spotify",
      description: "Spotify is a digital music service that gives you access to millions of songs.",
      alertCount: 0,
      isEnabled: true,
      category: "DeApps",
      uninstall: true,
    },
    {
      title: "Chrome",
      description: "Google Chrome is a web browser developed by Google.",
      alertCount: 3,
      isEnabled: false,
      category: "DeApps",
      uninstall: true,
    },
    {
      title: "Discord",
      description: "Discord is a voice, video, and text communication app.",
      alertCount: 0,
      isEnabled: true,
      category: "DeApps",
      uninstall: true,
    },
    */
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
  optimize
}: Omit<SettingCardProps, "category">) => {
  const [enabled, setEnabled] = useState(isEnabled);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("High");

    return (
  <div className="relative">
    <Card className="w-full min-w-[250px] max-w-[350px] h-[184px] bg-[#101019] rounded-xl border border-solid border-[#14141e] overflow-hidden mx-auto">
      <CardContent className="p-0 h-full">
        <div className="flex flex-col h-full">
          {/* Title & Description */}
          <div className="flex flex-col p-5 gap-2 h-[120px]">
            <h3 className="font-text-lg-leading-7-semibold text-white line-clamp-2 text-sm leading-5">
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
                    <button className="w-full flex justify-center items-center gap-2 bg-pink-600 hover:bg-red-700 text-white text-xs px-6 py-2 rounded-md transition cursor-pointer">
                      <Wrench className="w-4 h-4" />
                      <span className="text-xs mb-1">Optimize</span>
                    </button>
                  ) : hasConfigure ? (
                  <div className="w-full flex justify-center">
                    <button className="flex items-center gap-2 bg-[#1A1A24] hover:bg-pink-600 text-white text-xs px-6 py-2 rounded-md transition cursor-pointer">
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>Configure</span>
                    </button>
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
                            <span className="text-pink-600 font-medium whitespace-norape">May increase system temperatures</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-xs pl-4">
                            <CircleCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-white font-medium">No warnings</span>
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
                          <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
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
