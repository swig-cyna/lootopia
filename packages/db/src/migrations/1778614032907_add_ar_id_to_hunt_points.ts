import type { Kysely } from "kysely"
import type { Database } from "@lootopia/db/schema"

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.alterTable("hunt_points").addColumn("arId", "text").execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.alterTable("hunt_points").dropColumn("arId").execute()
}
