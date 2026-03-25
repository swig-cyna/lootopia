import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  envDir: path.resolve(__dirname, "../../"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@lootopia/mobile": path.resolve(__dirname, "./src"),
      "@lootopia/api": path.resolve(__dirname, "../api/src"),
      "@lootopia/auth/client": path.resolve(__dirname, "../auth/src/client.ts"),
    },
  },
  server: {
    port: 3002,
    host: "0.0.0.0",
  },
  preview: {
    port: 3002,
    host: "0.0.0.0",
  },
})
