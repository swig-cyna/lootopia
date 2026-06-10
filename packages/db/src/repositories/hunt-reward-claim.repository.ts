import { db } from "@lootopia/db/index"
import { type HuntRewardClaimTable } from "@lootopia/db/models/hunt"
import { safeIn } from "@lootopia/db/utils"
import { type Insertable, type Selectable } from "kysely"

export type HuntRewardClaim = Selectable<HuntRewardClaimTable>

export type NewHuntRewardClaim = Insertable<HuntRewardClaimTable>

export const $huntRewardClaim = {
  create: (claim: NewHuntRewardClaim) =>
    db
      .insertInto("hunt_reward_claims")
      .values(claim)
      .onConflict((oc) => oc.doNothing())
      .returningAll()
      .executeTakeFirst(),

  byRewardAndUser: (huntRewardId: string, userId: string) =>
    db
      .selectFrom("hunt_reward_claims")
      .selectAll()
      .where("huntRewardId", "=", huntRewardId)
      .where("userId", "=", userId)
      .executeTakeFirst(),

  countByHuntIds: (huntIds: string[]) =>
    db
      .selectFrom("hunt_reward_claims")
      .innerJoin(
        "hunt_rewards",
        "hunt_rewards.id",
        "hunt_reward_claims.huntRewardId",
      )
      .select((eb) => [
        "hunt_rewards.huntId as huntId",
        eb.fn.countAll<number>().as("count"),
      ])
      .where((eb) => safeIn(eb, "hunt_rewards.huntId", huntIds))
      .groupBy("hunt_rewards.huntId")
      .execute(),
}
