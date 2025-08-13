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
  const [optimizeState, setOptimizeState] = useState<'idle' | 'optimizing' | 'optimized'>('idle');

  const handleOptimize = async () => {
    if (optimizeState === 'idle') {
      setOptimizeState('optimizing');
      // Simulate optimization process
      setTimeout(() => {
        setOptimizeState('optimized');
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
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.99995 0C4.02952 0 0 4.02951 0 9.00005C0 13.9708 4.02952 18 8.99995 18C13.9709 18 18 13.9708 18 9.00005C18 4.02983 13.971 0 8.99995 0ZM13.1273 12.9807C12.9661 13.245 12.62 13.3289 12.3556 13.1666C10.2425 11.8758 7.5824 11.5835 4.44962 12.2993C4.14774 12.3681 3.84682 12.1789 3.77804 11.8769C3.70893 11.5749 3.89733 11.274 4.19997 11.2052C7.62829 10.4219 10.569 10.7592 12.9413 12.209C13.2057 12.3713 13.2895 12.7163 13.1273 12.9807ZM14.2288 10.53C14.0257 10.8602 13.5937 10.9645 13.2638 10.7613C10.8446 9.27433 7.15693 8.84368 4.29551 9.71228C3.92441 9.82438 3.53247 9.61523 3.41984 9.24477C3.30807 8.87366 3.51731 8.48246 3.88777 8.36961C7.15628 7.37785 11.2197 7.85825 13.9978 9.56547C14.3277 9.7686 14.432 10.2005 14.2288 10.53ZM14.3234 7.97819C11.4228 6.25529 6.63709 6.09687 3.86767 6.93742C3.42295 7.0723 2.95266 6.82124 2.81789 6.37652C2.68312 5.93158 2.93396 5.46159 3.379 5.32639C6.5581 4.36128 11.843 4.54774 15.1825 6.53031C15.5834 6.76772 15.7145 7.28435 15.477 7.68382C15.2406 8.08384 14.7221 8.21571 14.3234 7.97819Z" fill="#1ED760"/>
                </svg>
              )}
              {title === "Chrome" && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1_10229)">
                <path d="M9 13.498C11.4853 13.498 13.5 11.4833 13.5 8.99802C13.5 6.51273 11.4853 4.49802 9 4.49802C6.51472 4.49802 4.5 6.51273 4.5 8.99802C4.5 11.4833 6.51472 13.498 9 13.498Z" fill="white"/>
                <path d="M9.00006 4.49999H16.793C16.0033 3.13175 14.8673 1.99555 13.4993 1.20561C12.1312 0.415677 10.5792 -0.000140719 8.99946 -3.04957e-05C7.4197 7.97276e-05 5.86781 0.416114 4.49984 1.20624C3.13186 1.99637 1.99603 3.13273 1.20654 4.50107L5.10302 11.25L5.10651 11.2491C4.71013 10.5656 4.50096 9.78962 4.50007 8.99948C4.49918 8.20935 4.70661 7.43294 5.10145 6.74852C5.49628 6.06411 6.06457 5.49588 6.74903 5.10112C7.43349 4.70636 8.20992 4.49901 9.00006 4.49999Z" fill="url(#paint0_linear_1_10229)"/>
                <path d="M9 12.5625C10.9675 12.5625 12.5625 10.9675 12.5625 9C12.5625 7.03249 10.9675 5.4375 9 5.4375C7.03249 5.4375 5.4375 7.03249 5.4375 9C5.4375 10.9675 7.03249 12.5625 9 12.5625Z" fill="#1A73E8"/>
                <path d="M12.8966 11.2511L9.00015 18C10.5799 18.0002 12.1319 17.5845 13.5 16.7947C14.8681 16.0048 16.0042 14.8687 16.794 13.5006C17.5838 12.1324 17.9994 10.5804 17.9991 9.00064C17.9988 7.42088 17.5827 5.86904 16.7924 4.50116H8.99947L8.99854 4.50465C9.78867 4.50312 10.5653 4.70993 11.25 5.10423C11.9347 5.49852 12.5034 6.06637 12.8987 6.75052C13.294 7.43466 13.5019 8.21094 13.5016 9.00108C13.5012 9.79122 13.2926 10.5673 12.8966 11.2511Z" fill="url(#paint1_linear_1_10229)"/>
                <path d="M5.10333 11.2512L1.20685 4.50226C0.416774 5.87026 0.000791301 7.42216 0.000732428 9.00192C0.000673555 10.5817 0.41654 12.1336 1.20652 13.5017C1.99649 14.8697 3.13273 16.0057 4.50099 16.7953C5.86924 17.585 7.42128 18.0005 9.00104 18L12.8975 11.2511L12.895 11.2485C12.5012 11.9336 11.9338 12.5027 11.25 12.8985C10.5662 13.2944 9.79006 13.5029 8.99992 13.5032C8.20978 13.5035 7.43354 13.2954 6.74943 12.9001C6.06533 12.5047 5.49755 11.9359 5.10333 11.2512Z" fill="url(#paint2_linear_1_10229)"/>
                </g>
                <defs>
                <linearGradient id="paint0_linear_1_10229" x1="1.20654" y1="5.62499" x2="16.793" y2="5.62499" gradientUnits="userSpaceOnUse">
                <stop stop-color="#D93025"/>
                <stop offset="1" stop-color="#EA4335"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1_10229" x1="7.7706" y1="17.8797" x2="15.5638" y2="4.38138" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FCC934"/>
                <stop offset="1" stop-color="#FBBC04"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1_10229" x1="9.97439" y1="17.4381" x2="2.18114" y2="3.93976" gradientUnits="userSpaceOnUse">
                <stop stop-color="#1E8E3E"/>
                <stop offset="1" stop-color="#34A853"/>
                </linearGradient>
                <clipPath id="clip0_1_10229">
                <rect width="18" height="18" fill="white"/>
                </clipPath>
                </defs>
                </svg>
                
              )}
              {title === "Discord" && (
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.2477 1.17085C14.0825 0.6257 12.8367 0.229504 11.5342 0.00390625C11.3742 0.293114 11.1873 0.682105 11.0585 0.991546C9.67387 0.78332 8.30201 0.78332 6.94287 0.991546C6.81404 0.682105 6.62292 0.293114 6.46152 0.00390625C5.15761 0.229504 3.91032 0.627156 2.74514 1.17374C0.394982 4.72515 -0.242108 8.18834 0.0764375 11.6024C1.63519 12.7664 3.14581 13.4735 4.63093 13.9362C4.99762 13.4316 5.32465 12.8951 5.60638 12.3297C5.06981 12.1258 4.5559 11.8742 4.07031 11.5821C4.19913 11.4867 4.32514 11.3869 4.44689 11.2842C7.40865 12.6695 10.6267 12.6695 13.5531 11.2842C13.6762 11.3869 13.8022 11.4867 13.9296 11.5821C13.4426 11.8756 12.9273 12.1273 12.3907 12.3312C12.6724 12.8951 12.9981 13.433 13.3662 13.9377C14.8527 13.4749 16.3647 12.7678 17.9235 11.6024C18.2973 7.64464 17.285 4.21325 15.2477 1.17085ZM6.00988 9.50277C5.12079 9.50277 4.39166 8.67275 4.39166 7.66199C4.39166 6.65123 5.10522 5.81977 6.00988 5.81977C6.91457 5.81977 7.64367 6.64977 7.6281 7.66199C7.62951 8.67275 6.91457 9.50277 6.00988 9.50277ZM11.9901 9.50277C11.101 9.50277 10.3718 8.67275 10.3718 7.66199C10.3718 6.65123 11.0854 5.81977 11.9901 5.81977C12.8947 5.81977 13.6238 6.64977 13.6083 7.66199C13.6083 8.67275 12.8947 9.50277 11.9901 9.50277Z" fill="#5865F2"/>
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
                      disabled={optimizeState === 'optimizing'}
                      className={`w-full flex justify-center items-center gap-2 text-xs px-6 py-2 rounded-md transition cursor-pointer ${
                        optimizeState === 'optimized' 
                          ? 'bg-[#282832] text-[#05DF72]' 
                          : optimizeState === 'optimizing'
                          ? 'bg-pink-600 cursor-not-allowed text-[#0A0A14]'
                          : 'bg-pink-600 hover:bg-red-700 text-[#0A0A14]'
                      }`}
                    >
                      {optimizeState === 'optimized' ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#05DF72"/>
                          </svg>
                          <span className="text-xs">Optimized</span>
                        </>
                      ) : optimizeState === 'optimizing' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#0A0A14] border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs">Optimizing...</span>
                        </>
                      ) : (
                        <>
                          <Wrench className="w-4 h-4 pt-1" />
                          <span className="text-sm">Optimize</span>
                        </>
                      )}
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
