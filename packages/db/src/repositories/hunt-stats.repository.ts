import { db } from "@lootopia/db/index"
import { safeIn } from "@lootopia/db/utils"
import { sql } from "kysely"

const DAY_BUCKET = sql<string>`to_char(date_trunc('day', "joinedAt"), 'YYYY-MM-DD')`

export const $huntStats = {
  participantCount: async (huntId: string) => {
    const row = await db
      .selectFrom("hunt_participations")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where("huntId", "=", huntId)
      .executeTakeFirst()

    return Number(row?.count ?? 0)
  },

  finisherCountsByHuntIds: (huntIds: string[]) =>
    db
      .selectFrom((eb) =>
        eb
          .selectFrom("hunt_participations as hp")
          .leftJoin(
            "hunt_point_completions as hpc",
            "hpc.huntParticipationId",
            "hp.id",
          )
          .where((eb2) => safeIn(eb2, "hp.huntId", huntIds))
          .select(["hp.id as participationId", "hp.huntId as huntId"])
          .select((eb2) =>
            eb2.fn.count("hpc.huntPointId").distinct().as("completed"),
          )
          .groupBy(["hp.id", "hp.huntId"])
          .as("part"),
      )
      .where("part.completed", ">", 0)
      .where((eb) =>
        eb(
          "part.completed",
          ">=",
          eb
            .selectFrom("hunt_points")
            .select((eb2) => eb2.fn.countAll<number>().as("count"))
            .whereRef("hunt_points.huntId", "=", "part.huntId"),
        ),
      )
      .select((eb) => [
        "part.huntId as huntId",
        eb.fn.countAll<number>().as("count"),
      ])
      .groupBy("part.huntId")
      .execute(),

  finisherRankings: (huntId: string, pointCount: number) =>
    db
      .selectFrom("hunt_participations as hp")
      .innerJoin(
        "hunt_point_completions as hpc",
        "hpc.huntParticipationId",
        "hp.id",
      )
      .where("hp.huntId", "=", huntId)
      .groupBy("hp.id")
      .having((eb) =>
        eb(eb.fn.count("hpc.huntPointId").distinct(), ">=", pointCount),
      )
      .select((eb) => [
        "hp.id as participationId",
        eb.fn.sum<number>("hpc.score").as("score"),
        eb.fn.max("hpc.completedAt").as("finishedAt"),
      ])
      .execute(),

  pointFunnel: (huntId: string) =>
    db
      .selectFrom("hunt_points as pt")
      .leftJoin("hunt_point_completions as hpc", "hpc.huntPointId", "pt.id")
      .where("pt.huntId", "=", huntId)
      .select((eb) => [
        "pt.id as pointId",
        "pt.position as position",
        eb.fn.count("hpc.id").as("completions"),
      ])
      .groupBy(["pt.id", "pt.position"])
      .orderBy("pt.position", "asc")
      .execute(),

  registrationsByDay: (huntIds: string[]) =>
    db
      .selectFrom("hunt_participations")
      .select((eb) => [
        DAY_BUCKET.as("day"),
        eb.fn.countAll<number>().as("count"),
      ])
      .where((eb) => safeIn(eb, "huntId", huntIds))
      .groupBy(DAY_BUCKET)
      .orderBy(DAY_BUCKET, "asc")
      .execute(),

  avgScore: async (huntId: string) => {
    const row = await db
      .selectFrom((eb) =>
        eb
          .selectFrom("hunt_participations as hp")
          .leftJoin(
            "hunt_point_completions as hpc",
            "hpc.huntParticipationId",
            "hp.id",
          )
          .where("hp.huntId", "=", huntId)
          .select("hp.id as participationId")
          .select((eb2) =>
            eb2.fn
              .coalesce(eb2.fn.sum<number>("hpc.score"), sql<number>`0`)
              .as("total"),
          )
          .groupBy("hp.id")
          .as("scores"),
      )
      .select((eb) => eb.fn.avg<number>("scores.total").as("avg"))
      .executeTakeFirst()

    return row?.avg ? Math.round(Number(row.avg)) : 0
  },

  huntSummariesByOrganizer: (organizerId: string) =>
    db
      .selectFrom("hunts as h")
      .leftJoin("hunt_participations as hp", "hp.huntId", "h.id")
      .where("h.organizerId", "=", organizerId)
      .select((eb) => [
        "h.id as huntId",
        "h.title as title",
        "h.status as status",
        eb.fn.count("hp.id").as("participantCount"),
      ])
      .groupBy(["h.id", "h.title", "h.status"])
      .execute(),
}
