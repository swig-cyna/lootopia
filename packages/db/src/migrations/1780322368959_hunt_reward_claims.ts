import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("hunt_reward_claims")
    .addColumn("id", "text", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("huntRewardId", "text", (col) =>
      col.notNull().references("hunt_rewards.id").onDelete("cascade"),
    )
    .addColumn("userId", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("claimedAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute()

  await db.schema
    .createIndex("hunt_reward_claims_rewardId_userId_unique_idx")
    .unique()
    .on("hunt_reward_claims")
    .columns(["huntRewardId", "userId"])
    .execute()

  await db.schema
    .createIndex("hunt_reward_claims_rewardId_idx")
    .on("hunt_reward_claims")
    .column("huntRewardId")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("hunt_reward_claims").execute()
}
