import {
  HUNT_SORT,
  HUNT_STATUS,
  type HuntSort,
} from "@lootopia/common/constants/hunt"
import { db } from "@lootopia/db/index"
import {
  type HuntTable,
  type ListOrganizerHuntsOptions,
} from "@lootopia/db/models/hunt"
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres"
import { sql, type Insertable, type Selectable, type Updateable } from "kysely"

const HUNT_SORT_ORDER: Record<
  HuntSort,
  { column: "createdAt" | "title"; direction: "asc" | "desc" }
> = {
  [HUNT_SORT.RECENT]: { column: "createdAt", direction: "desc" },
  [HUNT_SORT.OLDEST]: { column: "createdAt", direction: "asc" },
  [HUNT_SORT.TITLE]: { column: "title", direction: "asc" },
}

export type Hunt = Selectable<HuntTable>
export type NewHunt = Insertable<HuntTable>
export type HuntUpdate = Updateable<HuntTable>

export const $hunt = {
  byId: (id: string) =>
    db.selectFrom("hunts").selectAll().where("id", "=", id).executeTakeFirst(),

  byOrganizer: (
    organizerId: string,
    options: ListOrganizerHuntsOptions = {},
  ) => {
    const order = HUNT_SORT_ORDER[options.sort ?? HUNT_SORT.RECENT]

    let query = db
      .selectFrom("hunts")
      .selectAll("hunts")
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom("hunt_points")
            .selectAll("hunt_points")
            .whereRef("hunt_points.huntId", "=", "hunts.id")
            .orderBy("hunt_points.createdAt", "asc"),
        ).as("points"),
        jsonObjectFrom(
          eb
            .selectFrom("hunt_rewards")
            .selectAll("hunt_rewards")
            .whereRef("hunt_rewards.huntId", "=", "hunts.id"),
        ).as("reward"),
        eb
          .selectFrom("hunt_participations")
          .select((eb2) => eb2.fn.countAll<number>().as("count"))
          .whereRef("hunt_participations.huntId", "=", "hunts.id")
          .as("playerCount"),
        eb
          .selectFrom("hunt_point_completions")
          .innerJoin(
            "hunt_participations",
            "hunt_participations.id",
            "hunt_point_completions.huntParticipationId",
          )
          .select((eb2) => eb2.fn.countAll<number>().as("count"))
          .whereRef("hunt_participations.huntId", "=", "hunts.id")
          .as("completionCount"),
      ])
      .where("organizerId", "=", organizerId)

    if (options.status) {
      query = query.where("status", "=", options.status)
    }

    if (options.search) {
      query = query.where("title", "ilike", `%${options.search}%`)
    }

    return query.orderBy(order.column, order.direction)
  },

  findPublished: (userId: string) =>
    db
      .selectFrom("hunts")
      .selectAll("hunts")
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom("hunt_points")
            .selectAll("hunt_points")
            .whereRef("hunt_points.huntId", "=", "hunts.id")
            .orderBy("hunt_points.createdAt", "asc"),
        ).as("points"),
        jsonObjectFrom(
          eb
            .selectFrom("hunt_rewards")
            .selectAll("hunt_rewards")
            .whereRef("hunt_rewards.huntId", "=", "hunts.id"),
        ).as("reward"),
        jsonObjectFrom(
          eb
            .selectFrom("hunt_participations")
            .selectAll("hunt_participations")
            .whereRef("hunt_participations.huntId", "=", "hunts.id")
            .where("hunt_participations.userId", "=", userId),
        ).as("participation"),
      ])
      .where("status", "=", HUNT_STATUS.PUBLISHED)
      .orderBy("createdAt", "desc"),

  byJoinedByUser: (userId: string) =>
    db
      .selectFrom("hunts")
      .innerJoin(
        "hunt_participations",
        "hunt_participations.huntId",
        "hunts.id",
      )
      .selectAll("hunts")
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom("hunt_points")
            .selectAll("hunt_points")
            .whereRef("hunt_points.huntId", "=", "hunts.id")
            .orderBy("hunt_points.createdAt", "asc"),
        ).as("points"),
        jsonObjectFrom(
          eb
            .selectFrom("hunt_rewards")
            .selectAll("hunt_rewards")
            .whereRef("hunt_rewards.huntId", "=", "hunts.id"),
        ).as("reward"),
      ])
      .where("hunt_participations.userId", "=", userId)
      .where("hunts.status", "=", HUNT_STATUS.PUBLISHED)
      .orderBy("hunt_participations.joinedAt", "desc"),

  byIdWithDetails: (id: string) =>
    db
      .selectFrom("hunts")
      .selectAll("hunts")
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom("hunt_points")
            .selectAll("hunt_points")
            .select((eb2) => [
              jsonObjectFrom(
                eb2
                  .selectFrom("quiz_questions")
                  .selectAll("quiz_questions")
                  .whereRef(
                    "quiz_questions.huntPointId",
                    "=",
                    "hunt_points.id",
                  ),
              ).as("quizQuestion"),
            ])
            .whereRef("hunt_points.huntId", "=", "hunts.id")
            .orderBy("hunt_points.createdAt", "asc"),
        ).as("points"),
        jsonObjectFrom(
          eb
            .selectFrom("hunt_rewards")
            .selectAll("hunt_rewards")
            .whereRef("hunt_rewards.huntId", "=", "hunts.id"),
        ).as("reward"),
      ])
      .where("hunts.id", "=", id)
      .executeTakeFirst(),

  create: (hunt: NewHunt) =>
    db
      .insertInto("hunts")
      .values(hunt)
      .returningAll()
      .executeTakeFirstOrThrow(),

  update: (id: string, hunt: HuntUpdate) =>
    db
      .updateTable("hunts")
      .set({ ...hunt, updatedAt: sql`NOW()` })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst(),

  countByStatusForOrganizer: (organizerId: string) =>
    db
      .selectFrom("hunts")
      .select((eb) => [
        eb.fn
          .countAll<number>()
          .filterWhere("status", "=", HUNT_STATUS.PUBLISHED)
          .as("published"),
        eb.fn
          .countAll<number>()
          .filterWhere("status", "=", HUNT_STATUS.DRAFT)
          .as("draft"),
      ])
      .where("organizerId", "=", organizerId)
      .executeTakeFirstOrThrow(),

  delete: (id: string) => db.deleteFrom("hunts").where("id", "=", id).execute(),
}
