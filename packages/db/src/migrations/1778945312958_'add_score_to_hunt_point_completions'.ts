import type { Kysely } from "kysely"
import type { Database } from "@lootopia/db/schema"

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable("hunt_point_completions")
    .addColumn("score", "integer", (col) => col.notNull().defaultTo(0))
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable("hunt_point_completions")
    .dropColumn("score")
    .execute()
}
