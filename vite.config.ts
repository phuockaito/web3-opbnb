import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";

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
    ],
    resolve: {
        alias: [{ find: "@", replacement: "/src" }],
    },
});
