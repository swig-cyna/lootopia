import type { Kysely } from "kysely"
import type { Database } from "@lootopia/db/schema"

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable("user")
    .addColumn("role", "text", (col) => col.defaultTo("player"))
    .addColumn("banned", "boolean", (col) => col.defaultTo(false))
    .addColumn("banReason", "text")
    .addColumn("banExpires", "bigint")
    .execute()

  await db.schema
    .alterTable("session")
    .addColumn("impersonatedBy", "text")
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable("user")
    .dropColumn("role")
    .dropColumn("banned")
    .dropColumn("banReason")
    .dropColumn("banExpires")
    .execute()

  await db.schema.alterTable("session").dropColumn("impersonatedBy").execute()
}
