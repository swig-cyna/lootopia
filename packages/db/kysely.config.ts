import { defineConfig } from "kysely-ctl"
import "tsconfig-paths/register"
import { dialect } from "@lootopia/db"

export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: "./src/migrations",
  },
  seeds: {
    seedFolder: "./src/seeds",
  },
})
