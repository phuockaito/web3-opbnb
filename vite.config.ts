import react from "@vitejs/plugin-react";
import polyfillNode from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
    plugins: [
        react(),
        dynamicImport({
            filter(id) {
                if (id.includes(`./${id}.ts`)) {
                    return true;
                }
            },
        }),
        nodePolyfills({
            include: ["path"],
            // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
            exclude: [
                "http", // Excludes the polyfill for `http` and `node:http`.
            ],
            // Whether to polyfill specific globals.
            globals: {
                Buffer: true, // can also be 'build', 'dev', or false
                global: true,
                process: true,
            },
            // Override the default polyfills for specific modules.
            overrides: {
                // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
                fs: "memfs",
            },
            // Whether to polyfill `node:` protocol imports.
            protocolImports: true,
        }),
    ],
    build: {
        rollupOptions: {
            plugins: [polyfillNode()],
        },
    },
    define: {
        "process.env": process.env,
        global: {},
    },
    resolve: {
        alias: [{ find: "@", replacement: "/src" }],
    },
});
