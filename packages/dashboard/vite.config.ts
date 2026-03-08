import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@lootopia/dashboard": path.resolve(__dirname, "./src"),
      "@lootopia/api": path.resolve(__dirname, "../api/src"),
      "@lootopia/auth/client": path.resolve(
        __dirname,
        "../auth/src/client.ts",
      ),
    },
  },
  server: {
    port: 3001,
    host: "0.0.0.0",
  },
  preview: {
    port: 3001,
    host: "0.0.0.0",
  },
})
