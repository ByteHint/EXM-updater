import { Check, ChevronDown } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

interface DropdownOption {
    value: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: React.ReactNode;
    className?: string;
    buttonClassName?: string;
    size?: "sm" | "md";
}

export const Dropdown = ({
    options,
    value,
    onValueChange,
    placeholder = "Select option",
    className = "",
    buttonClassName = "",
    size = "md",
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(
        null,
    );
    const [availableHeight, setAvailableHeight] = useState<number>(0);

    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue: string) => {
        onValueChange(optionValue);
        setIsOpen(false);
    };

    // Position the menu using a portal to avoid clipping/stacking issues
    useLayoutEffect(() => {
        if (!isOpen) return;
        const update = () => {
            const btn = buttonRef.current;
            if (!btn) return;
            const rect = btn.getBoundingClientRect();
            setMenuRect({ top: rect.bottom + 4, left: rect.left, width: rect.width });
            const spaceBelow = Math.max(140, Math.round(window.innerHeight - rect.bottom - 8));
            setAvailableHeight(spaceBelow);
        };
        update();
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
        };
    }, [isOpen]);

    const sizeButtonClasses =
        size === "sm"
            ? "px-2 py-1 h-7 text-xs"
            : "px-3 py-[9px] h-auto text-sm";
    const sizeItemClasses = size === "sm" ? "px-2 py-1.5 text-xs" : "px-3 py-2.5";

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between gap-2 ${sizeButtonClasses} rounded-[10px] border border-dashed border-[#1e1e28] bg-core-grey800 text-white hover:bg-core-grey700 ${buttonClassName}`}
                ref={buttonRef}
            >
                <div className="flex items-center gap-2">
                    {selectedOption?.icon}
                    <span className={size === "sm" ? "text-xs" : "text-sm"}>
                        {selectedOption?.label || placeholder}
                    </span>
                </div>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </Button>

            {isOpen &&
                menuRect &&
                createPortal(
                    <div
                        style={{
                            position: "fixed",
                            top: Math.round(menuRect.top),
                            left: Math.round(menuRect.left),
                            width: Math.round(menuRect.width),
                            zIndex: 999999,
                            backgroundColor: "#0F0F17",
                            maxHeight: availableHeight,
                            overflowY: "auto",
                        }}
                        className="min-w-[200px] border border-[#1e1e28] rounded-[12px] shadow-2xl overflow-hidden p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-opacity-100"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`w-full text-left rounded-md hover:bg-[#1a1a24] transition-colors ${sizeItemClasses} mb-1 last:mb-0 flex items-center justify-between gap-3 focus:outline-none`}
                            >
                                <div className="flex items-center gap-2">
                                    {option.icon}
                                    <span className={`${value === option.value ? "text-white" : "text-gray-300"} ${size === "sm" ? "text-xs" : "text-sm"}`}>
                                        {option.label}
                                    </span>
                                </div>
                                {value === option.value && <Check className="w-4 h-4 text-white" />}
                            </button>
                        ))}
                    </div>,
                    document.body,
                )}
        </div>
    );
};
