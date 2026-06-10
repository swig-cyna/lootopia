import tailwindcss from "@tailwindcss/vite"
import basicSsl from "@vitejs/plugin-basic-ssl"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  envDir: path.resolve(__dirname, "../../"),
  plugins: [react(), tailwindcss(), basicSsl()],
  resolve: {
    alias: {
      "@lootopia/dashboard": path.resolve(__dirname, "./src"),
      "@lootopia/api": path.resolve(__dirname, "../api/src"),
      "@lootopia/auth/client": path.resolve(__dirname, "../auth/src/client.ts"),
    },
  },
  server: {
    port: 3001,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (pathname) => pathname.replace(/^\/api/u, ""),
      },
    },
  },
  preview: {
    port: 3001,
    host: "0.0.0.0",
  },
})
