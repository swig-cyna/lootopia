import { db } from "@lootopia/db/index"
import { type HuntPointCompletionTable } from "@lootopia/db/models/hunt"
import { type Insertable, type Selectable } from "kysely"

export type HuntPointCompletion = Selectable<HuntPointCompletionTable>

export type NewHuntPointCompletion = Insertable<HuntPointCompletionTable>

export const $huntPointCompletion = {
  create: (completion: NewHuntPointCompletion) =>
    db
      .insertInto("hunt_point_completions")
      .values(completion)
      .onConflict((oc) => oc.doNothing())
      .returningAll()
      .executeTakeFirst(),

  byParticipationId: (huntParticipationId: string) =>
    db
      .selectFrom("hunt_point_completions")
      .select(["huntPointId", "score"])
      .where("huntParticipationId", "=", huntParticipationId),
}
