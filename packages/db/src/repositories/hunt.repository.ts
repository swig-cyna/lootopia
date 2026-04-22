import { db } from "@lootopia/db/index"
import type {
  HuntPointTable,
  HuntRewardTable,
  HuntTable,
  QuizQuestionTable,
} from "@lootopia/db/models/hunt"
import { sql, type Insertable, type Selectable, type Updateable } from "kysely"

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

export const $hunt = {
  findById: (id: string) =>
    db.selectFrom("hunts").selectAll().where("id", "=", id).executeTakeFirst(),

  findByOrganizer: (organizerId: string, page: number, limit: number) =>
    db
      .selectFrom("hunts")
      .selectAll()
      .where("organizerId", "=", organizerId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .offset((page - 1) * limit)
      .execute(),

  countByOrganizer: (organizerId: string) =>
    db
      .selectFrom("hunts")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where("organizerId", "=", organizerId)
      .executeTakeFirstOrThrow(),

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
    db.selectFrom("hunts").selectAll().where("id", "=", id).executeTakeFirst(),

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
      .where("id", "in", id)
      .returningAll()
      .executeTakeFirst(),

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

  create: (huntReward: NewHuntReward[]) =>
    db.insertInto("hunt_rewards").values(huntReward).returningAll().execute(),

  update: (id: string, huntReward: HuntRewardUpdate) =>
    db
      .updateTable("hunt_rewards")
      .set(huntReward)
      .where("id", "in", id)
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
      .where("id", "in", id)
      .returningAll()
      .executeTakeFirst()
  },

  delete: (id: string) =>
    db.deleteFrom("quiz_questions").where("id", "=", id).execute(),
}
