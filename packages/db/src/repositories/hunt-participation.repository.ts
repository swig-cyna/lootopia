import { db } from "@lootopia/db/index"
import { type HuntParticipationTable } from "@lootopia/db/models/hunt"
import { type Insertable, type Selectable } from "kysely"

export type HuntParticipation = Selectable<HuntParticipationTable>
export type NewHuntParticipation = Insertable<HuntParticipationTable>

export const $huntParticipation = {
  create: (participation: NewHuntParticipation) =>
    db
      .insertInto("hunt_participations")
      .values(participation)
      .returningAll()
      .executeTakeFirstOrThrow(),

  byUserAndHunt: (userId: string, huntId: string) =>
    db
      .selectFrom("hunt_participations")
      .selectAll()
      .where("userId", "=", userId)
      .where("huntId", "=", huntId)
      .executeTakeFirst(),
}
