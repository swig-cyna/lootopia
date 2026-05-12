import type { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("hunt_points").addColumn("arId", "text").execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("hunt_points").dropColumn("arId").execute()
}
