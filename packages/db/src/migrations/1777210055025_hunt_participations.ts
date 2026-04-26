import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("hunt_participations")
    .addColumn("id", "text", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("huntId", "text", (col) =>
      col.notNull().references("hunts.id").onDelete("cascade"),
    )
    .addColumn("userId", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("joinedAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute()

  await db.schema
    .createIndex("hunt_participations_userId_huntId_unique_idx")
    .unique()
    .on("hunt_participations")
    .columns(["userId", "huntId"])
    .execute()

  await db.schema
    .createIndex("hunt_participations_userId_idx")
    .on("hunt_participations")
    .column("userId")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("hunt_participations").execute()
}
