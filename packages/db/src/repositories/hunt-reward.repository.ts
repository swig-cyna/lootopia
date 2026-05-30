import { db } from "@lootopia/db/index"
import { type HuntRewardTable } from "@lootopia/db/models/hunt"
import { type Insertable, type Selectable, type Updateable } from "kysely"

export type HuntReward = Selectable<HuntRewardTable>
export type NewHuntReward = Insertable<HuntRewardTable>
export type HuntRewardUpdate = Updateable<HuntRewardTable>

export const $huntReward = {
  create: (huntReward: NewHuntReward) =>
    db.insertInto("hunt_rewards").values(huntReward).returningAll().execute(),

  update: (id: string, huntReward: HuntRewardUpdate) =>
    db
      .updateTable("hunt_rewards")
      .set(huntReward)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst(),
}
