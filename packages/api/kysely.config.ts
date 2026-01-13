import { defineConfig } from "kysely-ctl"
import "tsconfig-paths/register"
import { dialect } from "./src/db"

export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: "./src/db/migrations",
  },
  seeds: {
    seedFolder: "./src/db/seeds",
  },
})
