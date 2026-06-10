import { db } from "@lootopia/db/index"
import { type HuntParticipationTable } from "@lootopia/db/models/hunt"
import { type Insertable, type Selectable, sql } from "kysely"

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

  myRank: async (huntId: string, userId: string) => {
    const scoresQuery = db
      .selectFrom("hunt_participations as hp")
      .leftJoin(
        "hunt_point_completions as hpc",
        "hpc.huntParticipationId",
        "hp.id",
      )
      .select([
        "hp.userId",
        (eb) =>
          eb.fn
            .coalesce(eb.fn.sum<number>("hpc.score"), sql<number>`0`)
            .as("totalScore"),
        (eb) =>
          eb.fn
            .coalesce(eb.fn.count<number>("hpc.id"), sql<number>`0`)
            .as("completedPoints"),
      ])
      .where("hp.huntId", "=", huntId)
      .groupBy("hp.userId")

    const rankedQuery = db
      .selectFrom(scoresQuery.as("sq"))
      .select([
        "userId",
        "totalScore",
        "completedPoints",
        sql<number>`row_number() over (order by "totalScore" desc)`.as("rank"),
      ])

    const row = await db
      .selectFrom(rankedQuery.as("rq"))
      .selectAll()
      .where("userId", "=", userId)
      .executeTakeFirst()

    if (!row) {
      return null
    }

    return {
      rank: Number(row.rank),
      totalScore: Number(row.totalScore),
      completedPoints: Number(row.completedPoints),
    }
  },

  leaderboard: (huntId: string, search?: string) =>
    db
      .selectFrom("hunt_participations as hp")
      .innerJoin("user as u", "u.id", "hp.userId")
      .leftJoin(
        "hunt_point_completions as hpc",
        "hpc.huntParticipationId",
        "hp.id",
      )
      .select([
        "hp.userId",
        "u.name",
        "u.image",
        (eb) =>
          eb.fn
            .coalesce(eb.fn.sum<number>("hpc.score"), sql<number>`0`)
            .as("totalScore"),
        (eb) =>
          eb.fn
            .coalesce(eb.fn.count<number>("hpc.id"), sql<number>`0`)
            .as("completedPoints"),
      ])
      .where("hp.huntId", "=", huntId)
      .$if(Boolean(search), (qb) =>
        qb.where(sql`lower(u.name)`, "like", sql`lower(${`%${search}%`})`),
      )
      .groupBy(["hp.userId", "u.name", "u.image"])
      .orderBy("totalScore", "desc"),
}
