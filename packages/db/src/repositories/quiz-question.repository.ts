import { db } from "@lootopia/db/index"
import { type QuizQuestionTable } from "@lootopia/db/models/hunt"
import { type Insertable, type Selectable, type Updateable } from "kysely"

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

export const $quizQuestion = {
  byId: (id: string) =>
    db
      .selectFrom("quiz_questions")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst(),

  byHuntPointId: (huntPointId: string) =>
    db
      .selectFrom("quiz_questions")
      .selectAll()
      .where("huntPointId", "=", huntPointId)
      .executeTakeFirst(),

  byHuntPointIds: (huntPointId: string[]) =>
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
