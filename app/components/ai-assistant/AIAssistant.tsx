"use client";

import { useState } from "react";
import { Plus, Pin } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChatHistory, PremiumBanner } from "./index";

export default function AIAssistant() {
    const [message, setMessage] = useState("");
    const [characterCount, setCharacterCount] = useState(0);
    const maxCharacters = 500;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= maxCharacters) {
            setMessage(value);
            setCharacterCount(value.length);
        }
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            // TODO: Implement message sending logic
            console.log("Sending message:", message);
            setMessage("");
            setCharacterCount(0);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-screen max-h-screen w-full bg-[#0D0D13] overflow-hidden">
            {/* Chat History Sidebar */}
            <div className="w-56 bg-[#0D0D13] backdrop-blur-sm border-r border-[#2C2C2C]/50 flex flex-col shadow-2xl overflow-hidden">
                <ChatHistory />
            </div>

            {/* Main Chat Interface */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                {/* Header */}
                <div className="flex items-center justify-between w-full px-3 py-2 border-b border-[#2C2C2C]/30 flex-shrink-0 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">AI Assistant</h1>
                            <p className="text-gray-400 text-base">
                                Feel free to ask any tweaking related questions.
                            </p>
                        </div>
                    </div>
                    <Button className="bg-gradient-to-r from-[#E91E63] to-[#FF4081] hover:from-[#E91E63]/90 hover:to-[#FF4081]/90 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                        <Plus className="w-3 h-3 mr-1" />
                        Create New Chat
                    </Button>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col px-3 py-2 overflow-hidden min-h-0">
                    {/* Premium Banner - Above Input */}
                    <div className="mb-2 pt-50 flex-shrink-0 flex justify-center">
                        <PremiumBanner />
                    </div>

                    {/* Input Area */}
                    <div className="relative w-full max-w-2xl mx-auto flex-shrink-0 p-5">
                        <div className="relative">
                            <Input
                                value={message}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about tweaks, BIOS, debloat..."
                                className="w-full h-[88px] pl-4 pr-16 pb-10 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-sm text-white placeholder-gray-400 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]"
                            />

                            {/* EXM AI 1.0 Badge */}
                            <div className="absolute left-3 bottom-1 flex items-center gap-2">
                                <Pin className="w-2.5 h-2.5 text-purple-400" />
                                <span className="text-xs text-purple-400 font-medium">
                                    EXM AI 1.0
                                </span>
                            </div>

                            {/* Character Count */}
                            <div className="absolute right-3 bottom-1 text-xs text-gray-500">
                                {characterCount}/{maxCharacters}
                            </div>

                            {/* Send Arrow Icon */}
                            <div className="absolute right-5 top-4">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect width="20" height="20" rx="10" fill="#3B3B44" />
                                    <path
                                        d="M10 4.66675V15.3334"
                                        stroke="#1A1A24"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M13.3327 8.00005C13.3327 8.00005 10.8777 4.66675 9.99934 4.66675C9.12094 4.66674 6.66602 8.00008 6.66602 8.00008"
                                        stroke="#1A1A24"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
