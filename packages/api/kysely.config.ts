import { defineConfig } from "kysely-ctl"
import { dialect } from "./src/db/index.ts"

export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: "./src/db/migrations",
  },
  seeds: {
    seedFolder: "./src/db/seeds",
  },
})
