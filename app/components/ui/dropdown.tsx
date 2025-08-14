import { Check, ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./button";

interface DropdownOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    buttonClassName?: string;
}

export const Dropdown = ({
    options,
    value,
    onValueChange,
    placeholder = "Select option",
    className = "",
    buttonClassName = "",
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between gap-2 px-3 py-[9px] h-auto rounded-[10px] border border-dashed border-[#1e1e28] bg-core-grey800 text-white hover:bg-core-grey700 ${buttonClassName}`}
            >
                <div className="flex items-center gap-2">
                    {selectedOption?.icon}
                    <span className="text-sm">{selectedOption?.label || placeholder}</span>
                </div>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </Button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full min-w-[160px] bg-[#0f0f18] border border-[#1e1e28] rounded-[10px] shadow-lg z-50 overflow-hidden">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left hover:bg-[#1a1a24] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                {option.icon}
                                <span
                                    className={`${value === option.value ? "text-white" : "text-core-grey400"}`}
                                >
                                    {option.label}
                                </span>
                            </div>
                            {value === option.value && <Check className="w-4 h-4 text-white" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
