import { db } from "@lootopia/db"
import { Migrator, type MigrationProvider } from "kysely"
import migrations from "migrations:all"

const provider: MigrationProvider = {
  // eslint-disable-next-line require-await
  getMigrations: async () => migrations,
}

const migrator = new Migrator({ db, provider })

async function migrate() {
  const { error, results } = await migrator.migrateToLatest()

  for (const result of results ?? []) {
    if (result.status === "Success") {
      console.log(`Migration "${result.migrationName}" applied`)
    } else if (result.status === "Error") {
      console.error(`Migration "${result.migrationName}" failed`)
    }
  }

  if (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }

  console.log("All migrations applied successfully")
  await db.destroy()
}

migrate()
