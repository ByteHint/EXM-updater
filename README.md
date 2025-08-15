# EXM Tweaks Frontend Implementation Guide

## Overview

This document provides the implementation roadmap for the EXM Tweaks frontend application using Electron + React. It covers the renderer process, main process, IPC communication, and native module integration.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Application                  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │            Main Process (Node.js)               │   │
│  │  - System Operations                            │   │
│  │  - Native Module Bridge                         │   │
│  │  - License Validation                           │   │
│  │  - Background Services                          │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↕ IPC                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Renderer Process (React)                │   │
│  │  - UI Components                                │   │
│  │  - State Management (Zustand)                   │   │
│  │  - Real-time Monitoring                         │   │
│  │  - User Interactions                            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Core Modules Implementation

### 1. Main Process Setup

#### Entry Point Configuration

```javascript
// electron/main/index.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { MainApplication } = require("./application");

class MainProcess {
    constructor() {
        this.mainWindow = null;
        this.backgroundService = null;
        this.tray = null;
        this.initializeApp();
    }

    initializeApp() {
        // Single instance lock
        const gotTheLock = app.requestSingleInstanceLock();

        if (!gotTheLock) {
            app.quit();
            return;
        }

        app.whenReady().then(() => {
            this.createMainWindow();
            this.setupIPC();
            this.initializeServices();
            this.setupSecurity();
        });
    }

    createMainWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            minWidth: 960,
            minHeight: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, "preload.js"),
                webSecurity: true,
            },
            frame: false, // Custom title bar
            backgroundColor: "#1a1a1a",
        });
    }
}
```

### 2. System Scanner Module

#### Implementation Structure

```javascript
// modules/scanner/SystemScanner.js
class SystemScanner {
    constructor() {
        this.scanners = {
            registry: new RegistryScanner(),
            disk: new DiskScanner(),
            memory: new MemoryScanner(),
            startup: new StartupScanner(),
            network: new NetworkScanner(),
        };
        this.scanHistory = [];
    }

    async performFullScan(options = {}) {
        const scanId = this.generateScanId();
        const results = {
            scanId,
            timestamp: Date.now(),
            system: await this.getSystemInfo(),
            issues: [],
            recommendations: [],
            metrics: {},
        };

        // Progress tracking
        const totalSteps = Object.keys(this.scanners).length;
        let currentStep = 0;

        for (const [name, scanner] of Object.entries(this.scanners)) {
            if (options[name] !== false) {
                this.sendProgress(++currentStep, totalSteps, `Scanning ${name}...`);

                try {
                    const scanResult = await scanner.scan();
                    results.issues.push(...scanResult.issues);
                    results.recommendations.push(...scanResult.recommendations);
                    results.metrics[name] = scanResult.metrics;
                } catch (error) {
                    console.error(`Scanner ${name} failed:`, error);
                    results.errors = results.errors || [];
                    results.errors.push({ scanner: name, error: error.message });
                }
            }
        }

        results.healthScore = this.calculateHealthScore(results);
        this.scanHistory.push(results);

        return results;
    }

    calculateHealthScore(results) {
        let score = 100;

        results.issues.forEach((issue) => {
            switch (issue.severity) {
                case "critical":
                    score -= 10;
                    break;
                case "high":
                    score -= 5;
                    break;
                case "medium":
                    score -= 2;
                    break;
                case "low":
                    score -= 1;
                    break;
            }
        });

        return Math.max(0, score);
    }
}
```

### 3. Optimization Engine

#### Core Implementation

```javascript
// modules/optimizer/OptimizationEngine.js
class OptimizationEngine {
    constructor() {
        this.optimizers = new Map();
        this.backupManager = new BackupManager();
        this.initializeOptimizers();
    }

    initializeOptimizers() {
        // Registry Optimizer
        this.optimizers.set("registry", {
            optimizer: new RegistryOptimizer(),
            priority: 1,
            requiresBackup: true,
            requiresElevation: true,
        });

        // Startup Optimizer
        this.optimizers.set("startup", {
            optimizer: new StartupOptimizer(),
            priority: 2,
            requiresBackup: true,
            requiresElevation: false,
        });

        // Service Optimizer
        this.optimizers.set("services", {
            optimizer: new ServiceOptimizer(),
            priority: 3,
            requiresBackup: true,
            requiresElevation: true,
        });

        // Memory Optimizer
        this.optimizers.set("memory", {
            optimizer: new MemoryOptimizer(),
            priority: 4,
            requiresBackup: false,
            requiresElevation: false,
        });

        // Disk Optimizer
        this.optimizers.set("disk", {
            optimizer: new DiskOptimizer(),
            priority: 5,
            requiresBackup: false,
            requiresElevation: false,
        });

        // Network Optimizer
        this.optimizers.set("network", {
            optimizer: new NetworkOptimizer(),
            priority: 6,
            requiresBackup: true,
            requiresElevation: true,
        });
    }

    async optimize(issues, options = {}) {
        const optimizationId = this.generateOptimizationId();
        const results = {
            optimizationId,
            timestamp: Date.now(),
            backup: null,
            optimizations: [],
            errors: [],
        };

        // Create system restore point
        if (!options.skipBackup) {
            try {
                results.backup = await this.backupManager.createRestorePoint(
                    `PCOptimizer_${optimizationId}`,
                );
            } catch (error) {
                if (!options.forceOptimization) {
                    throw new Error("Failed to create backup: " + error.message);
                }
            }
        }

        // Sort issues by priority
        const sortedIssues = this.sortIssuesByPriority(issues);

        // Execute optimizations
        for (const issue of sortedIssues) {
            const optimizerConfig = this.optimizers.get(issue.category);

            if (!optimizerConfig) {
                results.errors.push({
                    issue: issue.id,
                    error: "No optimizer available for category: " + issue.category,
                });
                continue;
            }

            try {
                const result = await this.executeOptimization(optimizerConfig, issue, options);
                results.optimizations.push(result);
            } catch (error) {
                results.errors.push({
                    issue: issue.id,
                    error: error.message,
                });

                if (options.stopOnError) {
                    break;
                }
            }
        }

        return results;
    }

    async executeOptimization(config, issue, options) {
        // Check elevation requirements
        if (config.requiresElevation && !this.isElevated()) {
            throw new Error("Administrator privileges required");
        }

        // Execute optimization
        const startTime = Date.now();
        const result = await config.optimizer.fix(issue, options);

        return {
            issueId: issue.id,
            category: issue.category,
            success: result.success,
            duration: Date.now() - startTime,
            details: result.details,
        };
    }
}
```

### 4. IPC Communication Layer

#### Type-Safe IPC Implementation

```javascript
// ipc/handlers.js
const { ipcMain } = require("electron");

class IPCHandlers {
    constructor(services) {
        this.services = services;
        this.setupHandlers();
    }

    setupHandlers() {
        // System Operations
        ipcMain.handle("system:scan", async (event, options) => {
            return await this.services.scanner.performFullScan(options);
        });

        ipcMain.handle("system:optimize", async (event, issues, options) => {
            return await this.services.optimizer.optimize(issues, options);
        });

        ipcMain.handle("system:getInfo", async () => {
            return await this.services.system.getSystemInfo();
        });

        // License Operations
        ipcMain.handle("license:validate", async (event, key) => {
            return await this.services.license.validateLicense(key);
        });

        ipcMain.handle("license:activate", async (event, key) => {
            return await this.services.license.activateLicense(key);
        });

        // Monitoring Operations
        ipcMain.handle("monitor:start", async () => {
            return await this.services.monitor.startMonitoring();
        });

        ipcMain.handle("monitor:getMetrics", async () => {
            return await this.services.monitor.getCurrentMetrics();
        });

        // Update Operations
        ipcMain.handle("update:check", async () => {
            return await this.services.updater.checkForUpdates();
        });

        ipcMain.handle("update:download", async () => {
            return await this.services.updater.downloadUpdate();
        });

        ipcMain.handle("update:install", async () => {
            return await this.services.updater.installUpdate();
        });
    }
}

// Preload script for secure context bridge
// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    system: {
        scan: (options) => ipcRenderer.invoke("system:scan", options),
        optimize: (issues, options) => ipcRenderer.invoke("system:optimize", issues, options),
        getInfo: () => ipcRenderer.invoke("system:getInfo"),
    },
    license: {
        validate: (key) => ipcRenderer.invoke("license:validate", key),
        activate: (key) => ipcRenderer.invoke("license:activate", key),
    },
    monitor: {
        start: () => ipcRenderer.invoke("monitor:start"),
        getMetrics: () => ipcRenderer.invoke("monitor:getMetrics"),
        onMetricsUpdate: (callback) => {
            ipcRenderer.on("monitor:metrics", callback);
            return () => ipcRenderer.removeListener("monitor:metrics", callback);
        },
    },
    update: {
        check: () => ipcRenderer.invoke("update:check"),
        download: () => ipcRenderer.invoke("update:download"),
        install: () => ipcRenderer.invoke("update:install"),
    },
});
```

### 5. React Component Architecture

#### Main Application Component

```jsx
// renderer/src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LicenseProvider } from "./contexts/LicenseContext";
import { Layout } from "./components/Layout";
import { Routes } from "./routes";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
            retry: 3,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Initialize application
        initializeApp().then(() => {
            setIsInitialized(true);
        });
    }, []);

    if (!isInitialized) {
        return <SplashScreen />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <LicenseProvider>
                    <BrowserRouter>
                        <Layout>
                            <Routes />
                        </Layout>
                    </BrowserRouter>
                </LicenseProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

async function initializeApp() {
    // Check system requirements
    const systemInfo = await window.api.system.getInfo();

    if (!checkSystemRequirements(systemInfo)) {
        throw new Error("System requirements not met");
    }

    // Validate license
    try {
        await window.api.license.validate();
    } catch (error) {
        console.warn("License validation failed:", error);
    }

    // Start performance monitoring
    await window.api.monitor.start();
}
```

### 6. State Management with Zustand

```javascript
// stores/systemStore.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useSystemStore = create(
    devtools(
        persist(
            (set, get) => ({
                // State
                scanResults: null,
                isScanning: false,
                isOptimizing: false,
                systemHealth: 100,
                selectedIssues: [],
                optimizationHistory: [],

                // Actions
                startScan: async (options = {}) => {
                    set({ isScanning: true, scanResults: null });

                    try {
                        const results = await window.api.system.scan(options);
                        set({
                            scanResults: results,
                            systemHealth: results.healthScore,
                            isScanning: false,
                        });
                        return results;
                    } catch (error) {
                        set({ isScanning: false });
                        throw error;
                    }
                },

                selectIssue: (issueId) => {
                    const selectedIssues = get().selectedIssues;
                    if (selectedIssues.includes(issueId)) {
                        set({
                            selectedIssues: selectedIssues.filter((id) => id !== issueId),
                        });
                    } else {
                        set({
                            selectedIssues: [...selectedIssues, issueId],
                        });
                    }
                },

                selectAllIssues: () => {
                    const scanResults = get().scanResults;
                    if (scanResults) {
                        set({
                            selectedIssues: scanResults.issues.map((issue) => issue.id),
                        });
                    }
                },

                optimize: async (options = {}) => {
                    const selectedIssues = get().selectedIssues;
                    const scanResults = get().scanResults;

                    if (!scanResults || selectedIssues.length === 0) {
                        throw new Error("No issues selected for optimization");
                    }

                    set({ isOptimizing: true });

                    try {
                        const issues = scanResults.issues.filter((issue) =>
                            selectedIssues.includes(issue.id),
                        );

                        const results = await window.api.system.optimize(issues, options);

                        set((state) => ({
                            isOptimizing: false,
                            optimizationHistory: [results, ...state.optimizationHistory],
                            selectedIssues: [],
                            scanResults: null,
                        }));

                        return results;
                    } catch (error) {
                        set({ isOptimizing: false });
                        throw error;
                    }
                },
            }),
            {
                name: "system-store",
                partialize: (state) => ({
                    systemHealth: state.systemHealth,
                    optimizationHistory: state.optimizationHistory,
                }),
            },
        ),
    ),
);
```

### 7. Performance Monitoring UI

```jsx
// components/Monitor/PerformanceMonitor.jsx
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card } from "../ui/Card";

export function PerformanceMonitor() {
    const [metrics, setMetrics] = useState([]);
    const [currentMetrics, setCurrentMetrics] = useState(null);

    useEffect(() => {
        // Get initial metrics
        window.api.monitor.getMetrics().then(setCurrentMetrics);

        // Subscribe to real-time updates
        const unsubscribe = window.api.monitor.onMetricsUpdate((event, data) => {
            setMetrics((prev) => {
                const updated = [...prev, data];
                // Keep last 60 data points
                if (updated.length > 60) {
                    updated.shift();
                }
                return updated;
            });
            setCurrentMetrics(data);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* CPU Usage */}
            <Card>
                <h3 className="text-lg font-semibold mb-2">CPU Usage</h3>
                <div className="text-3xl font-bold text-blue-500">
                    {currentMetrics?.cpu.usage.toFixed(1)}%
                </div>
                <LineChart width={400} height={200} data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="cpu.usage"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </Card>

            {/* Memory Usage */}
            <Card>
                <h3 className="text-lg font-semibold mb-2">Memory Usage</h3>
                <div className="text-3xl font-bold text-green-500">
                    {currentMetrics?.memory.percentage.toFixed(1)}%
                </div>
                <LineChart width={400} height={200} data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="memory.percentage"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </Card>

            {/* Disk I/O */}
            <Card>
                <h3 className="text-lg font-semibold mb-2">Disk I/O</h3>
                <div className="flex gap-4">
                    <div>
                        <div className="text-sm text-gray-500">Read</div>
                        <div className="text-xl font-bold text-yellow-500">
                            {formatBytes(currentMetrics?.disk.read || 0)}/s
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Write</div>
                        <div className="text-xl font-bold text-orange-500">
                            {formatBytes(currentMetrics?.disk.write || 0)}/s
                        </div>
                    </div>
                </div>
            </Card>

            {/* Network I/O */}
            <Card>
                <h3 className="text-lg font-semibold mb-2">Network I/O</h3>
                <div className="flex gap-4">
                    <div>
                        <div className="text-sm text-gray-500">Download</div>
                        <div className="text-xl font-bold text-cyan-500">
                            {formatBytes(currentMetrics?.network.rx || 0)}/s
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Upload</div>
                        <div className="text-xl font-bold text-purple-500">
                            {formatBytes(currentMetrics?.network.tx || 0)}/s
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
```

## Security Implementation

### Anti-Tampering Protection

```javascript
// security/AntiTampering.js
class AntiTampering {
    constructor() {
        this.integrityChecks = new Map();
        this.initializeProtection();
    }

    initializeProtection() {
        // Periodic integrity checks
        setInterval(() => {
            this.verifyIntegrity();
        }, 60000); // Every minute

        // Check for debugger
        this.enableAntiDebugging();

        // Monitor suspicious processes
        this.monitorProcesses();
    }

    verifyIntegrity() {
        const files = ["main.js", "renderer.js", "preload.js"];

        files.forEach((file) => {
            const currentHash = this.calculateFileHash(file);
            const expectedHash = this.integrityChecks.get(file);

            if (expectedHash && currentHash !== expectedHash) {
                this.handleTampering(file);
            } else if (!expectedHash) {
                this.integrityChecks.set(file, currentHash);
            }
        });
    }

    enableAntiDebugging() {
        // Detect Chrome DevTools
        const detectDevTools = () => {
            const threshold = 160;
            if (window.outerHeight - window.innerHeight > threshold) {
                this.handleDebuggerDetected();
            }
        };

        setInterval(detectDevTools, 500);

        // Detect debugger statement
        const checkDebugger = () => {
            const start = performance.now();
            debugger;
            const end = performance.now();
            if (end - start > 100) {
                this.handleDebuggerDetected();
            }
        };

        setInterval(checkDebugger, 5000);
    }

    handleTampering(file) {
        // Log tampering attempt
        console.error(`File tampering detected: ${file}`);

        // Notify backend
        window.api.security.reportTampering({
            file,
            timestamp: Date.now(),
            hwid: this.getHardwareId(),
        });

        // Disable critical features
        this.disableFeatures();
    }
}
```

## Native Module Integration

### Building Native Modules

```javascript
// native/binding.gyp
{
  "targets": [
    {
      "target_name": "optimizer_native",
      "sources": [
        "src/registry.cc",
        "src/hardware.cc",
        "src/performance.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ],
      "conditions": [
        ["OS=='win'", {
          "libraries": [
            "-ladvapi32.lib",
            "-liphlpapi.lib",
            "-lpsapi.lib"
          ]
        }]
      ]
    }
  ]
}
```

### Using Native Modules

```javascript
// modules/native/NativeInterface.js
const native = require("../../build/Release/optimizer_native");

class NativeInterface {
    getHardwareInfo() {
        return new Promise((resolve, reject) => {
            native.getHardwareInfo((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    cleanRegistry(keys) {
        return new Promise((resolve, reject) => {
            native.cleanRegistry(keys, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    getPerformanceMetrics() {
        return new Promise((resolve, reject) => {
            native.getPerformanceMetrics((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}
```

## Testing Guidelines

### Unit Tests

```javascript
// __tests__/optimizer.test.js
describe("OptimizationEngine", () => {
    let engine;

    beforeEach(() => {
        engine = new OptimizationEngine();
    });

    test("should create backup before optimization", async () => {
        const spy = jest.spyOn(engine.backupManager, "createRestorePoint");

        await engine.optimize([{ id: "1", category: "registry", severity: "high" }]);

        expect(spy).toHaveBeenCalled();
    });

    test("should rollback on failure", async () => {
        const rollbackSpy = jest.spyOn(engine, "rollback");

        // Force an error
        engine.optimizers.get("registry").optimizer.fix = jest
            .fn()
            .mockRejectedValue(new Error("Optimization failed"));

        await expect(engine.optimize([{ id: "1", category: "registry" }])).rejects.toThrow();

        expect(rollbackSpy).toHaveBeenCalled();
    });
});
```

### E2E Tests

```javascript
// e2e/optimization-flow.test.js
const { _electron: electron } = require("playwright");

test("Complete optimization workflow", async () => {
    const app = await electron.launch({ args: ["dist/main.js"] });
    const window = await app.firstWindow();

    // Perform scan
    await window.click('[data-testid="scan-button"]');
    await window.waitForSelector('[data-testid="scan-complete"]', {
        timeout: 30000,
    });

    // Select issues
    await window.click('[data-testid="select-all"]');

    // Run optimization
    await window.click('[data-testid="optimize-button"]');
    await window.waitForSelector('[data-testid="optimization-complete"]', {
        timeout: 60000,
    });

    // Verify results
    const healthScore = await window.textContent('[data-testid="health-score"]');
    expect(parseInt(healthScore)).toBeGreaterThan(80);

    await app.close();
});
```

## Deployment Configuration

### Electron Builder Configuration

```json
{
    "appId": "com.company.pcoptimizer",
    "productName": "EXM Tweaks",
    "directories": {
        "output": "dist",
        "buildResources": "resources"
    },
    "files": ["dist/**/*", "node_modules/**/*", "!node_modules/**/test/**", "!**/*.map"],
    "asar": true,
    "asarUnpack": ["node_modules/optimizer_native/**/*"],
    "win": {
        "target": [
            {
                "target": "nsis",
                "arch": ["x64", "ia32"]
            }
        ],
        "icon": "resources/icon.ico",
        "certificateFile": "cert/certificate.p12",
        "certificatePassword": "${CERT_PASSWORD}",
        "publisherName": "Your Company",
        "requestedExecutionLevel": "highestAvailable",
        "signAndEditExecutable": true
    },
    "nsis": {
        "oneClick": false,
        "perMachine": true,
        "allowElevation": true,
        "allowToChangeInstallationDirectory": true,
        "createDesktopShortcut": true,
        "createStartMenuShortcut": true,
        "installerIcon": "resources/installer.ico",
        "uninstallerIcon": "resources/uninstaller.ico",
        "license": "LICENSE.txt",
        "runAfterFinish": true
    },
    "publish": {
        "provider": "generic",
        "url": "https://updates.pcoptimizer.com",
        "channel": "stable"
    }
}
```

## Performance Considerations

1. **Lazy Loading**: Load heavy modules only when needed
2. **Virtual Scrolling**: Use react-window for large lists
3. **Debouncing**: Debounce user inputs and API calls
4. **Web Workers**: Offload heavy computations to workers
5. **Memory Management**: Implement proper cleanup in useEffect
6. **Bundle Optimization**: Use code splitting and tree shaking

## Security Checklist

- [ ] Context isolation enabled
- [ ] Node integration disabled in renderer
- [ ] Input validation on all IPC calls
- [ ] CSP headers configured
- [ ] Auto-update signatures verified
- [ ] License validation implemented
- [ ] Anti-debugging measures active
- [ ] Code obfuscation applied
- [ ] Native modules signed
- [ ] Sensitive data encrypted
