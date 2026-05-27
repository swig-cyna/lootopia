import { db } from "@lootopia/db/index"
import {
  type HuntParticipationTable,
  type HuntPointCompletionTable,
  type HuntPointTable,
  type HuntRewardTable,
  type HuntTable,
  type ListOrganizerHuntsOptions,
  type QuizQuestionTable,
} from "@lootopia/db/models/hunt"
import {
  HUNT_SORT,
  HUNT_STATUS,
  type HuntSort,
} from "@lootopia/common/constants/hunt"
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

export type HuntPoint = Selectable<HuntPointTable>
export type NewHuntPoint = Insertable<HuntPointTable>
export type HuntPointUpdate = Updateable<HuntPointTable>

export type HuntReward = Selectable<HuntRewardTable>
export type NewHuntReward = Insertable<HuntRewardTable>
export type HuntRewardUpdate = Updateable<HuntRewardTable>

export type QuizQuestion = Selectable<QuizQuestionTable>
export type NewQuizQuestion = Omit<Insertable<QuizQuestionTable>, "answers"> & {
  answers: string[]
}
export type QuizQuestionUpdate = Omit<
  Updateable<QuizQuestionTable>,
  "answers"
> & {
  answers?: string[]
}

export type HuntParticipation = Selectable<HuntParticipationTable>
export type NewHuntParticipation = Insertable<HuntParticipationTable>

export type HuntPointCompletion = Selectable<HuntPointCompletionTable>
export type NewHuntPointCompletion = Insertable<HuntPointCompletionTable>

export const $hunt = {
  findById: (id: string) =>
    db.selectFrom("hunts").selectAll().where("id", "=", id).executeTakeFirst(),

  findByOrganizer: (
    organizerId: string,
    page: number,
    limit: number,
    options: ListOrganizerHuntsOptions = {},
  ) => {
    const order = HUNT_SORT_ORDER[options.sort ?? HUNT_SORT.RECENT]

    let query = db
      .selectFrom("hunts")
      .selectAll()
      .where("organizerId", "=", organizerId)

    if (options.status) {
      query = query.where("status", "=", options.status)
    }

    if (options.search) {
      query = query.where("title", "ilike", `%${options.search}%`)
    }

    return query
      .orderBy(order.column, order.direction)
      .limit(limit)
      .offset((page - 1) * limit)
      .execute()
  },

  countByOrganizer: (
    organizerId: string,
    options: Omit<ListOrganizerHuntsOptions, "sort"> = {},
  ) => {
    let query = db
      .selectFrom("hunts")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where("organizerId", "=", organizerId)

    if (options.status) {
      query = query.where("status", "=", options.status)
    }

    if (options.search) {
      query = query.where("title", "ilike", `%${options.search}%`)
    }

    return query.executeTakeFirstOrThrow()
  },

  countByOrganizerGrouped: (organizerId: string) =>
    db
      .selectFrom("hunts")
      .select("status")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where("organizerId", "=", organizerId)
      .groupBy("status")
      .execute(),

  findPublished: (page: number, limit: number) =>
    db
      .selectFrom("hunts")
      .selectAll()
      .where("status", "=", HUNT_STATUS.PUBLISHED)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .offset((page - 1) * limit)
      .execute(),

  countPublished: () =>
    db
      .selectFrom("hunts")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where("status", "=", HUNT_STATUS.PUBLISHED)
      .executeTakeFirstOrThrow(),

  findByIds: (ids: string[]) =>
    db.selectFrom("hunts").selectAll().where("id", "in", ids).execute(),

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

  delete: (id: string) => db.deleteFrom("hunts").where("id", "=", id).execute(),
}

export const $huntPoint = {
  findById: (id: string) =>
    db
      .selectFrom("hunt_points")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst(),

  findByHuntIds: (huntId: string[]) =>
    db
      .selectFrom("hunt_points")
      .selectAll()
      .where("huntId", "in", huntId)
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

  deleteByHuntId: (huntId: string) =>
    db.deleteFrom("hunt_points").where("huntId", "=", huntId).execute(),

  delete: (id: string) =>
    db.deleteFrom("hunt_points").where("id", "=", id).execute(),
}

export const $huntReward = {
  findById: (id: string) =>
    db
      .selectFrom("hunt_rewards")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst(),

  findByHuntIds: (huntId: string[]) =>
    db
      .selectFrom("hunt_rewards")
      .selectAll()
      .where("huntId", "in", huntId)
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

export const $quizQuestion = {
  findById: (id: string) =>
    db
      .selectFrom("quiz_questions")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst(),

  findByHuntPointId: (huntPointId: string) =>
    db
      .selectFrom("quiz_questions")
      .selectAll()
      .where("huntPointId", "=", huntPointId)
      .executeTakeFirst(),

  findByHuntPointIds: (huntPointId: string[]) =>
    db
      .selectFrom("quiz_questions")
      .selectAll()
      .where("huntPointId", "in", huntPointId)
      .execute(),

  create: (quizQuestion: NewQuizQuestion[]) =>
    db
      .insertInto("quiz_questions")
      .values(
        quizQuestion.map(({ answers, ...rest }) => ({
          ...rest,
          answers: JSON.stringify(answers),
        })),
      )
      .returningAll()
      .execute(),

  update: (id: string, quizQuestion: QuizQuestionUpdate) => {
    const { answers, ...rest } = quizQuestion

    return db
      .updateTable("quiz_questions")
      .set({
        ...rest,
        ...(answers !== undefined && { answers: JSON.stringify(answers) }),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst()
  },

  delete: (id: string) =>
    db.deleteFrom("quiz_questions").where("id", "=", id).execute(),
}

export const $huntParticipation = {
  create: (participation: NewHuntParticipation) =>
    db
      .insertInto("hunt_participations")
      .values(participation)
      .returningAll()
      .executeTakeFirstOrThrow(),

  findByUser: (userId: string) =>
    db
      .selectFrom("hunt_participations")
      .selectAll()
      .where("userId", "=", userId)
      .orderBy("joinedAt", "desc")
      .execute(),

  findByUserAndHunt: (userId: string, huntId: string) =>
    db
      .selectFrom("hunt_participations")
      .selectAll()
      .where("userId", "=", userId)
      .where("huntId", "=", huntId)
      .executeTakeFirst(),

  countByHuntIds: (huntIds: string[]) =>
    db
      .selectFrom("hunt_participations")
      .select("huntId")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where("huntId", "in", huntIds)
      .groupBy("huntId")
      .execute(),
}

export const $huntPointCompletion = {
  create: (completion: NewHuntPointCompletion) =>
    db
      .insertInto("hunt_point_completions")
      .values(completion)
      .onConflict((oc) => oc.doNothing())
      .returningAll()
      .executeTakeFirst(),

  findByParticipationId: (huntParticipationId: string) =>
    db
      .selectFrom("hunt_point_completions")
      .select(["huntPointId", "score"])
      .where("huntParticipationId", "=", huntParticipationId)
      .execute(),

  countByHuntIds: (huntIds: string[]) =>
    db
      .selectFrom("hunt_point_completions")
      .innerJoin(
        "hunt_participations",
        "hunt_participations.id",
        "hunt_point_completions.huntParticipationId",
      )
      .select("hunt_participations.huntId as huntId")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where("hunt_participations.huntId", "in", huntIds)
      .groupBy("hunt_participations.huntId")
      .execute(),
}
