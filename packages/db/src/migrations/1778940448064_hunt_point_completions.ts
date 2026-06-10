import { sql, type Kysely } from "kysely"
import type { Database } from "@lootopia/db/schema"

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable("hunt_point_completions")
    .addColumn("id", "text", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("huntParticipationId", "text", (col) =>
      col.notNull().references("hunt_participations.id").onDelete("cascade"),
    )
    .addColumn("huntPointId", "text", (col) =>
      col.notNull().references("hunt_points.id").onDelete("cascade"),
    )
    .addColumn("completedAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute()

  await db.schema
    .createIndex("hunt_point_completions_participationId_pointId_unique_idx")
    .unique()
    .on("hunt_point_completions")
    .columns(["huntParticipationId", "huntPointId"])
    .execute()

  await db.schema
    .createIndex("hunt_point_completions_participationId_idx")
    .on("hunt_point_completions")
    .column("huntParticipationId")
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable("hunt_point_completions").execute()
}
