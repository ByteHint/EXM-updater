import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

export default defineConfig({
    main: {
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, "lib/main/main.ts"),
                },
            },
            minify: "esbuild",
            target: "node18",
        },
        resolve: {
            alias: {
                "@/app": resolve(__dirname, "app"),
                "@/lib": resolve(__dirname, "lib"),
                "@/resources": resolve(__dirname, "resources"),
            },
        },
        plugins: [externalizeDepsPlugin()],
    },
    preload: {
        build: {
            rollupOptions: {
                input: {
                    preload: resolve(__dirname, "lib/preload/preload.ts"),
                },
            },
            minify: "esbuild",
            target: "node18",
        },
        resolve: {
            alias: {
                "@/app": resolve(__dirname, "app"),
                "@/lib": resolve(__dirname, "lib"),
                "@/resources": resolve(__dirname, "resources"),
            },
        },
        plugins: [externalizeDepsPlugin()],
    },
    renderer: {
        root: "./app",
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, "app/index.html"),
                },
            },
            minify: "esbuild",
            target: "esnext",
            chunkSizeWarningLimit: 1000,
        },
        resolve: {
            alias: {
                "@/app": resolve(__dirname, "app"),
                "@/lib": resolve(__dirname, "lib"),
                "@/resources": resolve(__dirname, "resources"),
            },
        },
        plugins: [tailwindcss(), react()],
        server: {
            hmr: {
                overlay: false,
            },
        },
    },
});
