import path from "path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite(),tsconfigPaths(),],
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "./src/"),
      "@/server": path.resolve(__dirname, "../server/"),
      "@/components": path.resolve(__dirname, "./src/components/"),
      "@/hooks": path.resolve(__dirname, "./src/hooks/"),
      "@/api": path.resolve(__dirname, "./src/api/"),
    },
  },
  build: {
    outDir: path.resolve(import.meta.dir, "dist"),
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
