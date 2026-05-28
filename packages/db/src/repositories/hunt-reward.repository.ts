import { db } from "@lootopia/db/index"
import { type HuntRewardTable } from "@lootopia/db/models/hunt"
import { safeIn } from "@lootopia/db/utils"
import { type Insertable, type Selectable, type Updateable } from "kysely"

export type HuntReward = Selectable<HuntRewardTable>
export type NewHuntReward = Insertable<HuntRewardTable>
export type HuntRewardUpdate = Updateable<HuntRewardTable>

export const $huntReward = {
  byId: (id: string) =>
    db
      .selectFrom("hunt_rewards")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst(),

  byHuntIds: (huntId: string[]) =>
    db
      .selectFrom("hunt_rewards")
      .selectAll()
      .where((eb) => safeIn(eb, "huntId", huntId))
      .execute(),

  create: (huntReward: NewHuntReward) =>
    db.insertInto("hunt_rewards").values(huntReward).returningAll().execute(),

  update: (id: string, huntReward: HuntRewardUpdate) =>
    db
      .updateTable("hunt_rewards")
      .set(huntReward)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst(),

  delete: (id: string) =>
    db.deleteFrom("hunt_rewards").where("id", "=", id).execute(),
}
