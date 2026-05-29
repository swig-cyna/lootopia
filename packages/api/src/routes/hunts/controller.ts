import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { paginate } from "@lootopia/api/utils/responses"
import { HUNT_STATUS } from "@lootopia/common/constants/hunt"
import { db } from "@lootopia/db"
import { $huntPoint } from "@lootopia/db/repositories/hunt-point.repository"
import { $huntReward } from "@lootopia/db/repositories/hunt-reward.repository"
import { $hunt } from "@lootopia/db/repositories/hunt.repository"
import { paginateQuery, safeIn } from "@lootopia/db/utils"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

import type {
  createHuntRoute,
  deleteHuntRoute,
  getHuntRoute,
  listHuntsRoute,
  updateHuntRoute,
  updateHuntStatusRoute,
} from "@lootopia/api/routes/hunts/doc"
import { createHuntPoints } from "@lootopia/api/routes/hunts/utils"

export const createHuntController: RouteHandler<
  typeof createHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { title, description, points, reward } = req.valid("json")

  const hunt = await $hunt.create({
    title,
    description: description ?? "",
    organizerId: user.id,
  })

  await Promise.all([
    createHuntPoints(hunt.id, points),
    $huntReward.create({
      huntId: hunt.id,
      promoCode: reward.promoCode,
      topX: reward.topX,
    }),
  ])

  return json((await $hunt.byIdWithDetails(hunt.id))!, StatusCodes.CREATED)
}

export const listHuntsController: RouteHandler<
  typeof listHuntsRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { page, limit, status, search, sort } = req.valid("query")

  const [{ result: hunts, count }, statusCounts] = await Promise.all([
    paginateQuery(
      $hunt.byOrganizer(user.id, { status, search, sort }),
      { pageSize: limit, pageIndex: page - 1 },
      "id",
    ),
    db
      .selectFrom("hunts")
      .select("status")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where("organizerId", "=", user.id)
      .groupBy("status")
      .execute(),
  ])

  const huntIds = hunts.map((hunt) => hunt.id)

  const [participationCounts, completionCounts] = await Promise.all([
    db
      .selectFrom("hunt_participations")
      .select("huntId")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where((eb) => safeIn(eb, "huntId", huntIds))
      .groupBy("huntId")
      .execute(),
    db
      .selectFrom("hunt_point_completions")
      .innerJoin(
        "hunt_participations",
        "hunt_participations.id",
        "hunt_point_completions.huntParticipationId",
      )
      .select("hunt_participations.huntId as huntId")
      .select((eb) => eb.fn.countAll<number>().as("count"))
      .where((eb) => safeIn(eb, "hunt_participations.huntId", huntIds))
      .groupBy("hunt_participations.huntId")
      .execute(),
  ])

  const playerCountByHunt = new Map(
    participationCounts.map((row) => [row.huntId, Number(row.count)]),
  )
  const completionCountByHunt = new Map(
    completionCounts.map((row) => [row.huntId, Number(row.count)]),
  )

  const data = hunts.map((hunt) => {
    const playerCount = playerCountByHunt.get(hunt.id) ?? 0
    const totalCompletions = completionCountByHunt.get(hunt.id) ?? 0
    const completionRate =
      playerCount > 0 && hunt.points.length > 0
        ? Math.round(
            (totalCompletions / (playerCount * hunt.points.length)) * 100,
          )
        : 0

    return { ...hunt, playerCount, completionRate }
  })

  const publishedCount = Number(
    statusCounts.find((row) => row.status === HUNT_STATUS.PUBLISHED)?.count ??
      0,
  )
  const draftCount = Number(
    statusCounts.find((row) => row.status === HUNT_STATUS.DRAFT)?.count ?? 0,
  )

  return json(
    {
      ...paginate(data, Number(count), page, limit),
      counts: {
        all: publishedCount + draftCount,
        published: publishedCount,
        draft: draftCount,
      },
    },
    StatusCodes.OK,
  )
}

export const getHuntController: RouteHandler<
  typeof getHuntRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const { huntId } = req.valid("param")

  const hunt = await $hunt.byIdWithDetails(huntId)

  if (!hunt) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  return json(hunt, StatusCodes.OK)
}

export const updateHuntController: RouteHandler<
  typeof updateHuntRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const { huntId } = req.valid("param")
  const { title, description, points, reward } = req.valid("json")

  const hunt = await $hunt.update(huntId, {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
  })

  if (!hunt) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  await Promise.all([
    points
      ? (async () => {
          await $huntPoint.deleteByHuntId(hunt.id)
          await createHuntPoints(hunt.id, points)
        })()
      : undefined,
    reward
      ? $huntReward.update(reward.id, {
          topX: reward.topX,
          promoCode: reward.promoCode,
        })
      : undefined,
  ])

  const huntWithDetails = await $hunt.byIdWithDetails(hunt.id)

  if (!huntWithDetails?.reward) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  return json(huntWithDetails, StatusCodes.OK)
}

export const deleteHuntController: RouteHandler<
  typeof deleteHuntRoute,
  AuthenticatedContext
> = async ({ req, body }) => {
  const { huntId } = req.valid("param")

  await $hunt.delete(huntId)

  return body(null, StatusCodes.NO_CONTENT)
}

export const updateHuntStatusController: RouteHandler<
  typeof updateHuntStatusRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const { huntId } = req.valid("param")
  const { status } = req.valid("json")

  const hunt = await $hunt.update(huntId, { status })

  if (!hunt) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  const huntWithDetails = await $hunt.byIdWithDetails(hunt.id)

  if (!huntWithDetails?.reward) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  return json(huntWithDetails, StatusCodes.OK)
}
