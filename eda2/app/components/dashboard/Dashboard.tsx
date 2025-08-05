"use client";

import { useState } from "react";
import { ActionItemsSection } from "./ActionItem";
import { ControlPanelSection } from "./ControlPanelSection";
import { NotificationSection } from "./NotificationSection";
import { SettingsSection } from "./SettingsSection";
import Sidebar from "./Sidebar";

export default function Dashboard() {
    const [activeCategory, setActiveCategory] = useState("core");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [filterState, setFilterState] = useState<"all" | "enabled" | "disabled" | "alerts">(
        "all",
    );
    const [sortState, setSortState] = useState<"name" | "alerts" | "status">("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleTabChange = (tab: string) => {
        setActiveCategory(tab);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleSidebarCollapseChange = (isCollapsed: boolean) => {
        setIsSidebarCollapsed(isCollapsed);
    };
    const handleFilterChange = (filter: "all" | "enabled" | "disabled" | "alerts") => {
        setFilterState(filter);
    };

    const handleSortChange = (sort: "name" | "alerts" | "status", direction: "asc" | "desc") => {
        setSortState(sort);
        setSortDirection(direction);
    };

    // Compute filter counts for display
    const allSettings = [
        // Core Settings (3)
        { category: "core", isEnabled: false, alertCount: 1 },
        { category: "core", isEnabled: true, alertCount: 2 },
        { category: "core", isEnabled: true, alertCount: 0 },
        // Power Settings (3)
        { category: "power", isEnabled: true, alertCount: 0 },
        { category: "power", isEnabled: false, alertCount: 1 },
        { category: "power", isEnabled: true, alertCount: 0 },
        // Security Settings (3)
        { category: "security", isEnabled: false, alertCount: 3 },
        { category: "security", isEnabled: true, alertCount: 1 },
        { category: "security", isEnabled: false, alertCount: 2 },
        // QOL Settings (3)
        { category: "qol", isEnabled: true, alertCount: 0 },
        { category: "qol", isEnabled: true, alertCount: 5 },
        { category: "qol", isEnabled: true, alertCount: 0 },
        // Apps Settings (3)
        { category: "apps", isEnabled: true, alertCount: 8 },
        { category: "apps", isEnabled: true, alertCount: 3 },
        { category: "apps", isEnabled: false, alertCount: 0 },
        // Games Settings (3)
        { category: "games", isEnabled: true, alertCount: 0 },
        { category: "games", isEnabled: true, alertCount: 1 },
        { category: "games", isEnabled: true, alertCount: 0 },
    ];

    const categorySettings = allSettings.filter((setting) => setting.category === activeCategory);

    const filteredSettings = categorySettings.filter((setting) => {
        const matchesSearch = searchQuery === ""; // Simplified for now
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

        return matchesSearch && matchesFilter;
    });

    const handleRefreshClick = async () => {
        // Implement refresh functionality
        return new Promise((resolve) => setTimeout(resolve, 500));
    };

    return (
        <div className="flex flex-row h-full bg-[#0A0A0F]">
            {/* Sidebar */}
            <Sidebar onCollapseChange={handleSidebarCollapseChange} />
            <div
                className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-0" : ""}`}
            >
                <ActionItemsSection activeCategory={activeCategory} />
                <NotificationSection onTabChange={handleTabChange} />
                <ControlPanelSection
                    onSearchChange={handleSearchChange}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                    onRefreshClick={handleRefreshClick}
                    filterState={filterState}
                    sortState={sortState}
                    sortDirection={sortDirection}
                    filteredCount={filteredSettings.length}
                    totalCount={categorySettings.length}
                />
                <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-320px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-2">
                    <SettingsSection
                        activeCategory={activeCategory}
                        searchQuery={searchQuery}
                        filterState={filterState}
                        sortState={sortState}
                        sortDirection={sortDirection}
                        isSidebarCollapsed={isSidebarCollapsed}
                    />
                </div>
            </div>
        </div>
    );
}
