import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("hunt_status")
    .asEnum(["draft", "published"])
    .execute()

  await db.schema
    .createTable("hunts")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("status", sql`hunt_status`, (col) => col.notNull().defaultTo("draft"))
    .addColumn("organizerId", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("createdAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute()

  await db.schema
    .createTable("hunt_points")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("huntId", "text", (col) =>
      col.notNull().references("hunts.id").onDelete("cascade"),
    )
    .addColumn("latitude", "float8", (col) => col.notNull())
    .addColumn("longitude", "float8", (col) => col.notNull())
    .addColumn("gameType", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute()

  await db.schema
    .createTable("hunt_rewards")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("huntId", "text", (col) =>
      col.notNull().references("hunts.id").onDelete("cascade"),
    )
    .addColumn("topX", "integer", (col) => col.notNull())
    .addColumn("promoCode", "text", (col) => col.notNull())
    .execute()

  await db.schema
    .createTable("quiz_questions")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("huntPointId", "text", (col) =>
      col.notNull().references("hunt_points.id").onDelete("cascade"),
    )
    .addColumn("question", "text", (col) => col.notNull())
    .addColumn("answers", "jsonb", (col) => col.notNull())
    .addColumn("correctAnswerIndex", "integer", (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex("hunts_organizerId_idx")
    .on("hunts")
    .column("organizerId")
    .execute()

  await db.schema
    .createIndex("hunt_points_huntId_idx")
    .on("hunt_points")
    .column("huntId")
    .execute()

  await db.schema
    .createIndex("hunt_rewards_huntId_idx")
    .on("hunt_rewards")
    .column("huntId")
    .execute()

  await db.schema
    .createIndex("quiz_questions_huntPointId_idx")
    .on("quiz_questions")
    .column("huntPointId")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("quiz_questions").execute()
  await db.schema.dropTable("hunt_rewards").execute()
  await db.schema.dropTable("hunt_points").execute()
  await db.schema.dropTable("hunts").execute()
  await db.schema.dropType("hunt_status").execute()
}
