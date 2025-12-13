import { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("user")
    .addColumn("role", "text", (col) => col.defaultTo("user"))
    .addColumn("banned", "boolean", (col) => col.defaultTo(false))
    .addColumn("banReason", "text")
    .addColumn("banExpires", "bigint")
    .execute()

  await db.schema
    .alterTable("session")
    .addColumn("impersonatedBy", "text")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("user")
    .dropColumn("role")
    .dropColumn("banned")
    .dropColumn("banReason")
    .dropColumn("banExpires")
    .execute()

  await db.schema.alterTable("session").dropColumn("impersonatedBy").execute()
}
