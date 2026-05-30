import { db } from "@lootopia/db/index"
import { type HuntPointTable } from "@lootopia/db/models/hunt"
import { safeIn } from "@lootopia/db/utils"
import { type Insertable, type Selectable, type Updateable } from "kysely"

export type HuntPoint = Selectable<HuntPointTable>
export type NewHuntPoint = Insertable<HuntPointTable>
export type HuntPointUpdate = Updateable<HuntPointTable>

export const $huntPoint = {
  byId: (id: string) =>
    db
      .selectFrom("hunt_points")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst(),

  byHuntIds: (huntId: string[]) =>
    db
      .selectFrom("hunt_points")
      .selectAll()
      .where((eb) => safeIn(eb, "huntId", huntId))
      .orderBy("createdAt", "asc")
      .execute(),

  create: (huntPoint: NewHuntPoint[]) =>
    db.insertInto("hunt_points").values(huntPoint).returningAll().execute(),

  update: (id: string, huntpoint: HuntPointUpdate) =>
    db
      .updateTable("hunt_points")
      .set(huntpoint)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst(),

  delete: (id: string) =>
    db.deleteFrom("hunt_points").where("id", "=", id).execute(),
}
