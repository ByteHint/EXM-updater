import {
    AlertTriangle,
    ArrowDownAZ,
    Eye,
    EyeOff,
    Filter,
    List,
    RefreshCw,
    Search,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dropdown } from "../ui/dropdown";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

interface ControlPanelSectionProps {
    onSearchChange?: (query: string) => void;
    onFilterChange?: (filter: "all" | "enabled" | "disabled" | "alerts") => void;
    onSortChange?: (sort: "name" | "alerts" | "status", direction: "asc" | "desc") => void;
    onRefreshClick?: () => void;
    filterState?: "all" | "enabled" | "disabled" | "alerts";
    sortState?: "name" | "alerts" | "status";
    sortDirection?: "asc" | "desc";
    filteredCount?: number;
    totalCount?: number;
}

export const ControlPanelSection = ({
    onSearchChange,
    onFilterChange,
    onSortChange,
    onRefreshClick,
    filterState = "all",
    sortState = "name",
    sortDirection = "asc",
    filteredCount = 0,
    totalCount = 0,
}: ControlPanelSectionProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const filterOptions = [
        { value: "all", label: "All Items", icon: <List className="w-4 h-4" /> },
        {
            value: "enabled",
            label: "Enabled Only",
            icon: <Eye className="w-4 h-4 text-green-400" />,
        },
        {
            value: "disabled",
            label: "Disabled Only",
            icon: <EyeOff className="w-4 h-4 text-red-400" />,
        },
        {
            value: "alerts",
            label: "With Alerts",
            icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
        },
    ];

    const sortOptions = [
        { value: "name", label: "Name", icon: <ArrowDownAZ className="w-4 h-4" /> },
        { value: "alerts", label: "Alert Count", icon: <AlertTriangle className="w-4 h-4" /> },
        { value: "status", label: "Status", icon: <Filter className="w-4 h-4" /> },
    ];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearchChange?.(query);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await onRefreshClick?.();
        } finally {
            // Simulate refresh delay
            setTimeout(() => setIsRefreshing(false), 1000);
        }
    };

    const handleFilterChange = (newFilter: string) => {
        onFilterChange?.(newFilter as "all" | "enabled" | "disabled" | "alerts");
    };

    const handleSortChange = (newSort: string) => {
        // Toggle direction if same sort field, otherwise use ascending
        const newDirection = newSort === sortState && sortDirection === "asc" ? "desc" : "asc";
        onSortChange?.(newSort as "name" | "alerts" | "status", newDirection);
    };

    return (
        <div className="flex items-center gap-3 w-full my-4">
            {/* Search Input */}
            <div className="flex items-center gap-2.5 relative rounded-[10px] border border-[#1e1e28] overflow-hidden bg-core-grey800 px-3">
                <Search className="w-[18px] h-[18px] text-core-grey600" />
                <Input
                    placeholder="Search settings..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border-0 !bg-transparent px-2 py-[9px] h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>

            {/* Filter Dropdown */}
            <Dropdown
                options={filterOptions}
                value={filterState}
                onValueChange={handleFilterChange}
                placeholder="Filter"
                className="min-w-[140px]"
            />

            {/* Sort Dropdown */}
            <Dropdown
                options={sortOptions.map((option) => ({
                    ...option,
                    label: `${option.label} ${sortState === option.value ? (sortDirection === "asc" ? "↑" : "↓") : ""}`,
                }))}
                value={sortState}
                onValueChange={handleSortChange}
                placeholder="Sort by"
                className="min-w-[130px]"
            />

            {/* Results Count */}
            <div className="flex items-center gap-2 px-3 py-2 bg-core-grey800/50 rounded-[8px] border border-[#1e1e28]">
                <span className="text-xs text-core-grey400">
                    {filteredCount} of {totalCount} items
                </span>
            </div>

            {/* Vertical Separator */}
            <Separator orientation="vertical" className="h-5 w-[1px] bg-[#1e1e28]" />

            {/* Refresh Button */}
            <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2.5 px-3 py-[9px] h-auto rounded-[10px] border border-solid border-[#1e1e28] bg-core-grey800 text-white hover:bg-core-grey700 disabled:opacity-50"
            >
                <RefreshCw className={`w-[18px] h-[18px] ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh tweaks"}
            </Button>
        </div>
    );
};
