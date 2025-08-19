import {
    ArrowUpRight,
    ChevronDown,
    Cpu,
    Download,
    Gamepad,
    Globe,
    Home,
    LayoutDashboard,
    LogOut,
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
    X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { useAuthStore } from "../../store/useAuthStore";

interface SidebarProps {
    onCollapseChange?: (isCollapsed: boolean) => void;
    onSectionChange?: (section: string) => void;
}

export default function Sidebar({ onCollapseChange, onSectionChange }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState("General");
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [avatarLoadingStates, setAvatarLoadingStates] = useState<Record<string, boolean>>({});
    const [avatarError, setAvatarError] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const profileCardRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    // Get user data from auth store
    const { user, signOut } = useAuthStore();

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                profileCardRef.current &&
                !profileCardRef.current.contains(event.target as Node)
            ) {
                setIsProfileDropdownOpen(false);
            }
        };

        if (isProfileDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

    const handleToggle = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
        onCollapseChange?.(collapsed);
    };

    const handleSectionClick = (section: string) => {
        console.warn("Sidebar: Section clicked:", section);
        setActiveSection(section);
        onSectionChange?.(section);
    };

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
        setIsProfileDropdownOpen(false);
    };

    const handleConfirmLogout = async () => {
        try {
            // Show loading state in the modal
            const logoutButton = document.querySelector(
                "[data-logout-button]",
            ) as HTMLButtonElement;
            if (logoutButton) {
                logoutButton.disabled = true;
                logoutButton.textContent = "Logging out...";
            }

            // Call the backend logout API first
            await signOut();

            // Close the modal
            setShowLogoutModal(false);

            // The router will automatically redirect to /welcome due to auth state change
            console.log("Logout completed successfully");
        } catch (error) {
            console.error("Logout error:", error);
            // Even if the API call fails, we should still clear local state
            try {
                await signOut();
            } catch (secondError) {
                console.error("Second logout attempt failed:", secondError);
            }
            setShowLogoutModal(false);
        }
    };

    const handleCancelLogout = () => {
        // Reset the logout button state if it was in loading state
        const logoutButton = document.querySelector("[data-logout-button]") as HTMLButtonElement;
        if (logoutButton) {
            logoutButton.disabled = false;
            logoutButton.textContent = "Log out";
        }
        setShowLogoutModal(false);
    };

    const handleUpgradeClick = () => {
        navigate("/pricing");
        setIsProfileDropdownOpen(false);
    };

    const handleMenuItemClick = (action: string) => {
        console.log(`Menu item clicked: ${action}`);
        setIsProfileDropdownOpen(false);

        if (action === "leave-review") {
            setShowReviewModal(true);
        }
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
    };

    const handleDiscordReview = () => {
        window.open("https://discord.gg/pigeon", "_blank");
        setShowReviewModal(false);
    };

    const handleWebsiteReview = () => {
        window.open("https://pigeon.os/review", "_blank");
        setShowReviewModal(false);
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

    // Helper function to get user initials
    const getUserInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Helper function to get user display name
    const getUserDisplayName = () => {
        if (!user) return "Guest";
        return user.name || "User";
    };

    // Helper function to get user subscription status
    const getUserSubscriptionStatus = () => {
        // You can extend this based on your subscription logic
        return "Free User";
    };

    // Debug logging for avatar
    useEffect(() => {
        if (user) {
            console.log("Sidebar - User data:", {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                authProvider: user.authProvider,
            });

            if (user.avatar) {
                console.log("Sidebar - Avatar URL analysis:", {
                    originalUrl: user.avatar,
                    isValidUrl: isValidAvatarUrl(user.avatar),
                    proxiedUrl: getProxiedAvatarUrl(user.avatar),
                    isExternal:
                        !user.avatar.startsWith("/") &&
                        !user.avatar.startsWith("http://localhost") &&
                        !user.avatar.startsWith("https://localhost"),
                });
            }
        }
        // reset error state when user or avatar changes
        setAvatarError(false);
    }, [user]);

    // Helper function to handle avatar loading errors
    const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.warn("Avatar failed to load:", event.currentTarget.src);
        // Trigger fallback rendering
        setAvatarError(true);
        // Remove loading state
        const avatarUrl = event.currentTarget.src;
        setAvatarLoadingStates((prev) => ({ ...prev, [avatarUrl]: false }));
    };

    // Helper function to handle avatar loading success
    const handleAvatarLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.log("Avatar loaded successfully:", event.currentTarget.src);
        // Remove loading state
        const avatarUrl = event.currentTarget.src;
        setAvatarLoadingStates((prev) => ({ ...prev, [avatarUrl]: false }));
    };

    // Helper function to check if avatar URL is valid
    const isValidAvatarUrl = (url: string) => {
        if (!url) return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Helper function to get proxied avatar URL
    const getProxiedAvatarUrl = (avatarUrl: string): string => {
        if (!avatarUrl) return "";

        // If it's already a relative URL or localhost, return as is
        if (
            avatarUrl.startsWith("/") ||
            avatarUrl.startsWith("http://localhost") ||
            avatarUrl.startsWith("https://localhost")
        ) {
            return avatarUrl;
        }

        // For external URLs, use our proxy
        try {
            const encodedUrl = encodeURIComponent(avatarUrl);
            return `http://localhost:5000/api/v1/avatar-proxy?url=${encodedUrl}`;
        } catch {
            return avatarUrl; // Fallback to original URL
        }
    };

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
                        <img
                            className="res://icons/reset-password.svgw-[55px] h-[27px]"
                            alt="Logo"
                            src="res://icons/logo.png"
                        />
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
                            onClick={handleUpgradeClick}
                        >
                            <Sparkles className="w-3 h-3 text-pink-400" />
                            <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text">
                                Upgrade to Premium
                            </span>
                        </Button>
                    </div>
                    <div className="absolute bottom-[20px] left-3 flex items-center">
                        {/* User Profile */}
                        <Card
                            ref={profileCardRef}
                            className={`w-[216px] h-14 p-0 bg-[#1e1e28] rounded-xl border border-[#2a2a36] cursor-pointer transition-all duration-200 hover:bg-[#2a2a36] hover:border-[#3a3a46] ${isProfileDropdownOpen ? "bg-[#2a2a36] border-[#3a3a46]" : ""}`}
                            onClick={handleProfileClick}
                        >
                            <CardContent className="p-0">
                                <div className="flex items-center gap-3 p-2">
                                    <Avatar className="w-10 h-10 relative">
                                        {user?.avatar &&
                                        isValidAvatarUrl(user.avatar) &&
                                        !avatarError ? (
                                            <>
                                                <AvatarImage
                                                    src={getProxiedAvatarUrl(user.avatar)}
                                                    alt={getUserDisplayName()}
                                                    onError={handleAvatarError}
                                                    onLoad={handleAvatarLoad}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                                {avatarLoadingStates[user.avatar] && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-full">
                                                        <div className="w-4 h-4 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                                                    </div>
                                                )}
                                            </>
                                        ) : null}
                                        <AvatarFallback>
                                            {getUserInitials(getUserDisplayName())}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center justify-between flex-1">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">
                                                {getUserDisplayName()}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {getUserSubscriptionStatus()}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dropdown Menu */}
                        {isProfileDropdownOpen && (
                            <Card
                                ref={dropdownRef}
                                className="absolute bottom-0 left-[calc(100%+24px)] py-4 w-60 bg-[#1A1A24] border border-[#332E474D] z-[100] shadow-xl animate-in slide-in-from-top-2 duration-200"
                            >
                                <CardContent className="flex flex-col px-2 max-h-fit">
                                    <div className="flex items-center pb-4 gap-2 border-b border-gray-700/30">
                                        <Avatar className="w-10 h-10 relative">
                                            {user?.avatar &&
                                            isValidAvatarUrl(user.avatar) &&
                                            !avatarError ? (
                                                <>
                                                    <AvatarImage
                                                        src={getProxiedAvatarUrl(user.avatar)}
                                                        alt={getUserDisplayName()}
                                                        onError={handleAvatarError}
                                                        onLoad={handleAvatarLoad}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                    {avatarLoadingStates[user.avatar] && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-full">
                                                            <div className="w-4 h-4 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : null}
                                            <AvatarFallback>
                                                {getUserInitials(getUserDisplayName())}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center justify-between flex-1">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-white">
                                                    {getUserDisplayName()}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {user?.email || "No email"}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {getUserSubscriptionStatus()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="px-1.5 py-2 flex flex-col gap-1 border-b border-gray-700/30">
                                        <li
                                            className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 hover:bg-[#2a2a36] py-2 px-2 rounded-lg"
                                            onClick={() => handleMenuItemClick("settings")}
                                        >
                                            <Settings size={20} color="#81818C" />
                                            Settings
                                        </li>
                                        <li
                                            className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 hover:bg-[#2a2a36] py-2 px-2 rounded-lg"
                                            onClick={() => handleMenuItemClick("hardware-resets")}
                                        >
                                            <img
                                                src="res://icons/reset-password.svg"
                                                className="w-5"
                                            />
                                            Hardware Resets
                                        </li>
                                        <li
                                            className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 hover:bg-[#2a2a36] py-2 px-2 rounded-lg"
                                            onClick={() => handleMenuItemClick("leave-review")}
                                        >
                                            <img
                                                src="res://icons/quill-write-02.svg"
                                                className="w-5"
                                            />
                                            Leave a review
                                        </li>
                                        <li
                                            className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 hover:bg-[#2a2a36] py-2 px-2 rounded-lg"
                                            onClick={handleUpgradeClick}
                                        >
                                            <Sparkles className="text-pink-400" size={20} />
                                            <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text">
                                                Upgrade to Premium
                                            </span>
                                        </li>
                                    </ul>
                                    <ul className="px-1.5 py-2 flex flex-col gap-1">
                                        <a
                                            href="https://discord.gg/pigeon"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <li className="flex items-center justify-between gap-2 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 hover:bg-[#2a2a36] py-2 px-2 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src="res://icons/discord.svg"
                                                        className="w-5"
                                                    />
                                                    Join our Discord
                                                </div>
                                                <ArrowUpRight size={16} />
                                            </li>
                                        </a>
                                        <a
                                            href="https://pigeon.os/account"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <li className="flex items-center justify-between gap-2 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 hover:bg-[#2a2a36] py-2 px-2 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src="res://icons/user-account.svg"
                                                        className="w-5"
                                                    />
                                                    Account and Billing
                                                </div>
                                                <ArrowUpRight size={16} />
                                            </li>
                                        </a>
                                    </ul>
                                    <Button
                                        variant="ghost"
                                        className="w-full bg-[#1E1E28] text-white flex items-center justify-between hover:bg-[#2a2a36] transition-colors duration-200"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                        <LogOut size={16} />
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[200] flex items-center justify-center">
                    <Card className="w-[420px] bg-[#1A1A24] border border-[#332E474D] shadow-2xl">
                        <CardContent className="">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-white mb-4">Log out?</h3>
                                <Separator className="w-full h-px bg-gray-700/30 mb-4" />
                                <p className="text-sm text-gray-300 mb-6">
                                    Do you really want to log out? Your current settings will be
                                    reverted.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 bg-transparent border-gray-600 text-white hover:bg-gray-700"
                                        onClick={handleCancelLogout}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                        onClick={handleConfirmLogout}
                                        data-logout-button
                                    >
                                        Log out
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[200] flex items-center justify-center">
                    <Card className="w-[420px] bg-[#1A1A24] border border-[#332E474D] shadow-2xl">
                        <CardContent className="">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src="res://icons/quill-write-02.svg" className="w-5 h-5" />
                                    <h3 className="text-lg font-semibold text-white">
                                        Leave a review
                                    </h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-8 h-8 p-0 hover:bg-gray-700"
                                    onClick={handleCloseReviewModal}
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </Button>
                            </div>
                            <p className="text-sm text-gray-300 mb-6">
                                If you had a good experience with EXM Tweaks, a short review goes a
                                long way. It really helps us out - thanks a ton!
                            </p>
                            <div className="space-y-3">
                                <Button
                                    className="w-full bg-[#FF2E79] hover:bg-[#FF2E79]/90 text-black flex items-center gap-2"
                                    onClick={handleDiscordReview}
                                >
                                    <img src="res://icons/discord.svg" className="w-4 h-4" />
                                    Leave review on Discord
                                </Button>
                                <Button
                                    className="w-full bg-[#818CF8] hover:bg-[#818CF8]/90 text-black flex items-center gap-2"
                                    onClick={handleWebsiteReview}
                                >
                                    <Globe className="w-4 h-4" />
                                    Leave review on Website
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
