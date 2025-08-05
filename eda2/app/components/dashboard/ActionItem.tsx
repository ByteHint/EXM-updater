import {
    AppWindow,
    BatteryCharging,
    Gamepad2,
    Settings,
    Shield,
    Sparkles,
    Wand2,
} from "lucide-react";
import { Button } from "../ui/button";

interface ActionItemsSectionProps {
    activeCategory?: string;
}

export const ActionItemsSection = ({ activeCategory = "core" }: ActionItemsSectionProps) => {
    const categoryInfo = {
        core: {
            title: "Core System",
            description: "Essential system optimizations and performance tweaks.",
            icon: Settings,
        },
        power: {
            title: "Power Management",
            description: "Optimize power settings for maximum performance.",
            icon: BatteryCharging,
        },
        security: {
            title: "Security Settings",
            description: "Configure security features and privacy settings.",
            icon: Shield,
        },
        qol: {
            title: "Quality of Life",
            description: "Improve your daily computing experience.",
            icon: Wand2,
        },
        apps: {
            title: "Application Management",
            description: "Manage and optimize installed applications.",
            icon: AppWindow,
        },
        games: {
            title: "Gaming Performance",
            description: "Enhance gaming experience and reduce input lag.",
            icon: Gamepad2,
        },
    };

    const current = categoryInfo[activeCategory as keyof typeof categoryInfo] || categoryInfo.core;
    const CategoryIcon = current.icon;

    return (
        <section className="flex flex-row w-full items-start gap-1">
            <div className="flex flex-col w-full items-start gap-1">
                <div className="flex items-center gap-2">
                    <CategoryIcon className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-semibold text-white tracking-[-0.6px] leading-8 font-text-2xl-leading-8-semibold">
                        {current.title}
                    </h2>
                </div>
                <p className="text-base font-normal text-core-grey400 leading-6 font-text-base-leading-6-normal">
                    {current.description}
                </p>
            </div>
            <Button variant="clickauth">
                <Sparkles />
                Go Premium Now
            </Button>
        </section>
    );
};
