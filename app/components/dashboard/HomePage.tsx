import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/useAuthStore";
import { Power, Grid3X3, CheckCircle, Sparkles } from "lucide-react";

interface SystemMetrics {
    cpu: {
        usage: number;
        temperature: number;
        cores: number;
        model: string;
    };
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
    disk: {
        used: number;
        total: number;
        percentage: number;
        readSpeed: number;
        writeSpeed: number;
    };
    network: {
        rx: number;
        tx: number;
        connections: number;
    };
    gpu: {
        usage: number;
        temperature: number;
        memory: number;
        model: string;
    };
}

export default function HomePage() {
    const { user } = useAuthStore();
    const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
        cpu: {
            usage: 0,
            temperature: 0,
            cores: 0,
            model: "Loading...",
        },
        memory: {
            used: 0,
            total: 0,
            percentage: 0,
        },
        disk: {
            used: 0,
            total: 0,
            percentage: 0,
            readSpeed: 0,
            writeSpeed: 0,
        },
        network: {
            rx: 0,
            tx: 0,
            connections: 0,
        },
        gpu: {
            usage: 0,
            temperature: 0,
            memory: 0,
            model: "Loading...",
        },
    });

    const [performanceData, setPerformanceData] = useState<
        Array<{ time: number; cpu: number; memory: number; gpu: number }>
    >([]);
    const [activeTab, setActiveTab] = useState<"CPU" | "GPU" | "RAM">("CPU");
    const [backupCount] = useState(0);
    const [tweaksApplied] = useState(0);
    const [totalTweaks] = useState(0);
    const [spaceCleaned] = useState(0);

    // Initialize system data
    useEffect(() => {
        const initializeSystemData = async () => {
            try {
                // Get initial system info
                if (typeof window !== "undefined" && window.api) {
                    const systemInfo = await window.api.getSystemInfo();
                    if (systemInfo) {
                        setSystemMetrics((prev) => ({
                            ...prev,
                            cpu: {
                                ...prev.cpu,
                                model: systemInfo.cpu.model,
                                cores: systemInfo.cpu.cores,
                            },
                            memory: {
                                ...prev.memory,
                                total: systemInfo.memory.total,
                                used: systemInfo.memory.used,
                            },
                            gpu: {
                                ...prev.gpu,
                                model: systemInfo.gpu.model,
                            },
                        }));
                    }
                }
            } catch (error) {
                console.error("Error initializing system data:", error);
            }
        };

        initializeSystemData();
    }, []);

    // Real-time performance monitoring (strict 60s window, runs continuously)
    useEffect(() => {
        let isUnmounted = false;
        const interval = setInterval(async () => {
            try {
                if (typeof window !== "undefined" && window.api) {
                    // Get CPU usage
                    const cpuUsage = await window.api.getCpuUsage();

                    // Get memory usage
                    const memoryInfo = await window.api.getMemoryUsage();

                    // Get GPU usage
                    const gpuUsage = await window.api.getGpuUsage();

                    console.log(
                        `Performance Update: CPU=${cpuUsage}%, Memory=${memoryInfo?.percentage}%, GPU=${gpuUsage}%`,
                    );
                    console.log("Raw memory info:", memoryInfo);
                    console.log("Raw GPU usage:", gpuUsage);

                    // Update system metrics
                    if (!isUnmounted && memoryInfo)
                        setSystemMetrics((prev) => ({
                            ...prev,
                            cpu: {
                                ...prev.cpu,
                                usage: cpuUsage || 0,
                            },
                            memory: {
                                ...prev.memory,
                                used: memoryInfo.used || 0,
                                total: memoryInfo.total || 0,
                                percentage: memoryInfo.percentage || 0,
                            },
                            gpu: {
                                ...prev.gpu,
                                usage: gpuUsage || 0,
                            },
                        }));

                    // Update performance data
                    if (!isUnmounted && memoryInfo)
                        setPerformanceData((prev) => {
                            const newData = [...prev];
                            const currentTime = Date.now();

                            // Add new data point
                            const newPoint = {
                                time: currentTime,
                                cpu: cpuUsage || 0,
                                memory: memoryInfo.percentage || 0,
                                gpu: gpuUsage || 0,
                            };

                            console.log("Adding performance point:", newPoint);
                            newData.push(newPoint);

                            // Keep only the last 60 seconds
                            const sixtySecondsAgo = currentTime - 60000;
                            const pruned = newData.filter((d) => d.time >= sixtySecondsAgo);

                            return pruned;
                        });
                }
            } catch (error) {
                console.error("Error updating performance data:", error);
            }
        }, 1000);

        return () => {
            isUnmounted = true;
            clearInterval(interval);
        };
    }, []);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    const getHardwareTitle = () => {
        switch (activeTab) {
            case "CPU":
                return systemMetrics.cpu.model || "Loading CPU...";
            case "GPU":
                return systemMetrics.gpu.model || "Loading GPU...";
            case "RAM":
                return `${formatBytes(systemMetrics.memory.total)} System Memory`;
            default:
                return systemMetrics.cpu.model || "Loading...";
        }
    };

    return (
        <div className="flex-1 h-full bg-[#0A0A0F] text-white overflow-hidden">
            <div className="h-full overflow-y-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome Back, {user?.name || "Pigeon"}!
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Ready to enhance your system performance?
                        </p>
                    </div>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Go Premium Now
                    </Button>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Backup Card */}
                    <Card className="group relative overflow-hidden bg-[#12121a] border border-[#2a2a36] rounded-2xl transition-colors hover:bg-[#171722] hover:border-[#A5B4FC]/40">
                        <CardContent className="">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{
                                    background:
                                        "radial-gradient(120% 120% at 100% 100%, rgba(165,180,252,0.10) 0%, rgba(165,180,252,0) 60%)",
                                }}
                            />
                            <div className="flex items-center justify-between mb-4 relative">
                                <div className="w-10 h-10 rounded-xl border border-[#2a2a36] flex items-center justify-center">
                                    <Power size={16} className="text-[#A5B4FC]" />
                                </div>
                                <Button
                                    variant="ghost"
                                    className="rounded-xl border border-[#A5B4FC]/30 text-[#A5B4FC] hover:bg-[#A5B4FC]/10 hover:text-[#A5B4FC]"
                                >
                                    Create backup
                                </Button>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{backupCount}</div>
                            <div className="text-gray-400 text-sm">Backup found</div>
                        </CardContent>
                    </Card>

                    {/* Tweaks Card */}
                    <Card className="group relative overflow-hidden bg-[#12121a] border border-[#2a2a36] rounded-2xl transition-colors hover:bg-[#171722] hover:border-[#FF2056]/40">
                        <CardContent className="">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{
                                    background:
                                        "radial-gradient(120% 120% at 100% 100%, rgba(255,32,86,0.10) 0%, rgba(255,32,86,0) 60%)",
                                }}
                            />
                            <div className="flex items-center justify-between mb-4 relative">
                                <div className="w-10 h-10 rounded-xl border border-[#2a2a36] flex items-center justify-center">
                                    <Grid3X3 size={16} className="text-[#FF2056]" />
                                </div>
                                <Button
                                    variant="ghost"
                                    className="rounded-xl border border-[#FF2056]/30 text-[#FF2056] hover:bg-[#FF2056]/10 hover:text-[#FF2056]"
                                >
                                    Apply tweaks
                                </Button>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {tweaksApplied}/{totalTweaks}
                            </div>
                            <div className="text-gray-400 text-sm">Tweaks applied</div>
                        </CardContent>
                    </Card>

                    {/* Space Cleaned Card */}
                    <Card className="group relative overflow-hidden bg-[#12121a] border border-[#2a2a36] rounded-2xl transition-colors hover:bg-[#171722] hover:border-[#05DF72]/40">
                        <CardContent className="">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{
                                    background:
                                        "radial-gradient(120% 120% at 100% 100%, rgba(5,223,114,0.10) 0%, rgba(5,223,114,0) 60%)",
                                }}
                            />
                            <div className="flex items-center justify-between mb-4 relative">
                                <div className="w-10 h-10 rounded-xl border border-[#2a2a36] flex items-center justify-center">
                                    <CheckCircle size={16} className="text-[#05DF72]" />
                                </div>
                                <Button
                                    variant="ghost"
                                    className="rounded-xl border border-[#05DF72]/30 text-[#05DF72] hover:bg-[#05DF72]/10 hover:text-[#05DF72]"
                                >
                                    Debloat system
                                </Button>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {spaceCleaned} GB
                            </div>
                            <div className="text-gray-400 text-sm">Space cleaned</div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="bg-[#101019] border-[#2a2a36]">
                    <CardContent className="">
                        <div className="mb-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {getHardwareTitle()}
                                </h3>

                                {/* Performance Tabs */}
                                <div className="inline-flex items-center mb-6 rounded-xl bg-[#0D0D13] border border-[#1E1E28] p-1">
                                    {(["CPU", "GPU", "RAM"] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-1 cursor-pointer rounded-lg text-sm font-medium transition-colors ${
                                                activeTab === tab
                                                    ? "bg-[#1A1A24] text-white ring-1 ring-[#1E1E28]"
                                                    : "text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Graph */}
                            <PerformanceChart data={performanceData} activeTab={activeTab} />
                        </div>
                    </CardContent>
                </Card>
                {/* Bottom metric cards removed per requirements */}
            </div>
        </div>
    );
}

type ChartTab = "CPU" | "GPU" | "RAM";

function PerformanceChart({
    data,
    activeTab,
}: {
    data: Array<{ time: number; cpu: number; memory: number; gpu: number }>;
    activeTab: ChartTab;
}) {
    const width = 700; // SVG width used for coordinate calc; container is responsive
    const height = 200;
    const padding = { top: 10, right: 10, bottom: 20, left: 40 };
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    const keyMap: Record<ChartTab, "cpu" | "gpu" | "memory"> = {
        CPU: "cpu",
        GPU: "gpu",
        RAM: "memory",
    };

    const k = keyMap[activeTab];
    const points = data.map((d) => d[k] ?? 0);

    // Build path
    const n = Math.max(points.length, 1);
    const stepX = n > 1 ? innerW / (n - 1) : innerW;

    const toX = (i: number) => padding.left + i * stepX;
    const toY = (v: number) =>
        padding.top + innerH - (Math.max(0, Math.min(100, v)) / 100) * innerH;

    const pathD = points.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");

    const areaD = `${pathD} L${padding.left + (n - 1) * stepX},${padding.top + innerH} L${padding.left},${padding.top + innerH} Z`;

    const lastV = points[points.length - 1] ?? 0;
    const lastX = toX(n - 1);
    const lastY = toY(lastV);

    const verticalSegments = 6; // divide into parts; no timestamps
    const horizontalTicks = [0, 20, 40, 60, 80, 100];

    return (
        <div className="relative h-60 w-full bg-[#0D0D13] rounded-xl border border-[#1E1E28]">
            {/* Grid */}
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                {/* Horizontal grid with labels */}
                {horizontalTicks.map((p, idx) => {
                    const y = toY(p);
                    return (
                        <g key={idx}>
                            <line
                                x1={padding.left}
                                y1={y}
                                x2={padding.left + innerW}
                                y2={y}
                                stroke="#2a2a36"
                                strokeDasharray="4 4"
                            />
                            <text x={8} y={y + 4} fill="#6b7280" fontSize="12">
                                {p}%
                            </text>
                        </g>
                    );
                })}
                {/* Vertical segments including edges (0% and 100% time span markers) */}
                {Array.from({ length: verticalSegments + 1 }).map((_, i) => {
                    const x = padding.left + (innerW / verticalSegments) * i;
                    return (
                        <line
                            key={i}
                            x1={x}
                            y1={padding.top}
                            x2={x}
                            y2={padding.top + innerH}
                            stroke="#1e1e28"
                        />
                    );
                })}

                {/* Area fill */}
                <defs>
                    <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.70" />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.00" />
                    </linearGradient>
                </defs>
                <path d={areaD} fill="url(#perfFill)" stroke="none" />
                {/* Line */}
                <path d={pathD} fill="none" stroke="#4F46E5" strokeWidth={2} />
                {/* Last point */}
                <circle cx={lastX} cy={lastY} r={4} fill="#4F46E5" />
            </svg>

            {/* Current value indicator */}
            <div className="absolute top-3 right-3 rounded-lg text-sm font-medium text-white">
                {Math.round(lastV)}%
            </div>
        </div>
    );
}
