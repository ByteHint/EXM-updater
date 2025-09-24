"use client";

import { useState } from "react";
import { Square, Trash2 } from "lucide-react";
import { Separator } from "../ui/separator";

interface ChatItem {
    id: string;
    title: string;
    isNew?: boolean;
    hasUnread?: boolean;
}

export default function ChatHistory() {
    const [selectedChat, setSelectedChat] = useState("new-chat");

    const todayChats: ChatItem[] = [
        { id: "new-chat", title: "New chat", isNew: true, hasUnread: true },
        { id: "recommended", title: "What are the recommended...", hasUnread: false },
        { id: "process-count", title: "Does process count matter?", hasUnread: false },
    ];

    const yesterdayChats: ChatItem[] = [
        { id: "optimize-system", title: "How can I optimize my syste...", hasUnread: false },
    ];

    const handleChatSelect = (chatId: string) => {
        setSelectedChat(chatId);
    };

    const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implement chat deletion
        console.log("Deleting chat:", chatId);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-2 border-b border-[#2C2C2C]/30 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xs font-bold text-white">Open chats</h2>
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-400 font-medium">4/5</span>
                    </div>
                </div>
                <div className="flex items-center justify-between pb-5">
                    <h3 className="text-xs font-medium text-gray-400">Daily messages</h3>
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-1 bg-[#2C2C2C] rounded-full overflow-hidden">
                            <div className="w-4/5 h-full bg-gradient-to-r from-[#E91E63] to-[#FF4081] rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">17/20</span>
                    </div>
                </div>
            </div>

            <Separator className="mb-2" />
            {/* Chat Lists - Fixed Height, No Scroll */}
            <div className="flex-1 p-2 space-y-2 overflow-hidden">
                {/* Today Section */}
                <div className="flex-shrink-0">
                    <h4 className="text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider flex items-center gap-1">
                        <div className="w-0.5 h-2 bg-gradient-to-b from-[#E91E63] to-[#FF4081] rounded-full"></div>
                        Today
                    </h4>
                    <div className="space-y-1">
                        {todayChats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`cursor-pointer transition-all duration-300 hover:bg-[#2C2C2C]/30 rounded-lg p-2 flex items-center justify-between group ${
                                    selectedChat === chat.id ? "bg-[#2C2C2C]/50" : ""
                                }`}
                                onClick={() => handleChatSelect(chat.id)}
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {chat.isNew ? (
                                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                    ) : (
                                        <Square className="w-2 h-2 text-gray-500 flex-shrink-0" />
                                    )}
                                    <span
                                        className={`text-sm font-medium truncate ${
                                            selectedChat === chat.id
                                                ? "text-white"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        {chat.title}
                                    </span>
                                </div>
                                <Trash2
                                    className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                                    onClick={(e) => handleDeleteChat(chat.id, e)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Yesterday Section */}
                <div className="flex-shrink-0">
                    <h4 className="text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider flex items-center gap-1">
                        <div className="w-0.5 h-2 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full"></div>
                        Yesterday
                    </h4>
                    <div className="space-y-1">
                        {yesterdayChats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`cursor-pointer transition-all duration-300 hover:bg-[#2C2C2C]/30 rounded-lg p-2 flex items-center justify-between group ${
                                    selectedChat === chat.id ? "bg-[#2C2C2C]/50" : ""
                                }`}
                                onClick={() => handleChatSelect(chat.id)}
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Square className="w-2 h-2 text-gray-500 flex-shrink-0" />
                                    <span
                                        className={`text-sm font-medium truncate ${
                                            selectedChat === chat.id
                                                ? "text-white"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        {chat.title}
                                    </span>
                                </div>
                                <Trash2
                                    className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                                    onClick={(e) => handleDeleteChat(chat.id, e)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
