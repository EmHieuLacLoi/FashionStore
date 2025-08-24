import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@components": path.resolve(__dirname, "src/components"),
        "@models": path.resolve(__dirname, "src/models"),
        "@views": path.resolve(__dirname, "src/views"),
        "@routes": path.resolve(__dirname, "src/routes"),
        "@layouts": path.resolve(__dirname, "src/layouts"),
        "@constants": path.resolve(__dirname, "src/constants"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@services": path.resolve(__dirname, "src/services"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@configs": path.resolve(__dirname, "src/configs"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@lang": path.resolve(__dirname, "src/lang"),
      },
    },
    clearScreen: false,
    server: {
      port: 1420,
      strictPort: true,
      watch: {
        usePolling: true,
      },
    },
    preview: {
      port: 1420,
      strictPort: true,
    },
    define: {
      global: "globalThis",
    },
  };
});
