import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        // 👈 optimizedeps
        esbuildOptions: {
            target: "esnext",
            // Node.js global to browser globalThis
            define: {
                global: "globalThis",
            },
            supported: {
                bigint: true,
            },
        },
    },

    build: {
        target: ["esnext"], // 👈 build.target
    },
    server: {
        proxy: {
            // TODO: Change URL to non-local server
            "/sil": "http://dwms.sytes.net:44822",
            "/events": "ws://dwms.sytes.net:44822",
            "/cep": "ws://dwms.sytes.net:44822"
        },
    },
});
