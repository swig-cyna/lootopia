import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { paginate } from "@lootopia/api/utils/responses"
import { HUNT_STATUS } from "@lootopia/common/constants/hunt"
import {
  $hunt,
  $huntParticipation,
  $huntPoint,
  $huntPointCompletion,
  $huntReward,
} from "@lootopia/db/repositories/hunt.repository"
import * as StatusCodes from "stoker/http-status-codes"

import type {
  createHuntRoute,
  deleteHuntRoute,
  getHuntRoute,
  listHuntsRoute,
  updateHuntRoute,
  updateHuntStatusRoute,
} from "@lootopia/api/routes/hunts/doc"
import {
  buildHuntResponse,
  createHuntPoints,
} from "@lootopia/api/routes/hunts/utils"

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

  return json(await buildHuntResponse(hunt), StatusCodes.CREATED)
}

export const listHuntsController: RouteHandler<
  typeof listHuntsRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { page, limit, status, search, sort } = req.valid("query")

  const [hunts, { count }, statusCounts] = await Promise.all([
    $hunt.findByOrganizer(user.id, page, limit, { status, search, sort }),
    $hunt.countByOrganizer(user.id, { status, search }),
    $hunt.countByOrganizerGrouped(user.id),
  ])

  const huntIds = hunts.map((hunt) => hunt.id)

  const [huntPoints, huntRewards, participationCounts, completionCounts] =
    await Promise.all([
      $huntPoint.findByHuntIds(huntIds),
      $huntReward.findByHuntIds(huntIds),
      $huntParticipation.countByHuntIds(huntIds),
      $huntPointCompletion.countByHuntIds(huntIds),
    ])

  const playerCountByHunt = new Map(
    participationCounts.map((row) => [row.huntId, Number(row.count)]),
  )
  const completionCountByHunt = new Map(
    completionCounts.map((row) => [row.huntId, Number(row.count)]),
  )

  const data = hunts.map((hunt) => {
    const points = huntPoints.filter((point) => point.huntId === hunt.id)
    const playerCount = playerCountByHunt.get(hunt.id) ?? 0
    const totalCompletions = completionCountByHunt.get(hunt.id) ?? 0
    const completionRate =
      playerCount > 0 && points.length > 0
        ? Math.round((totalCompletions / (playerCount * points.length)) * 100)
        : 0

    return {
      ...hunt,
      points,
      reward: huntRewards.find((reward) => reward.huntId === hunt.id)!,
      playerCount,
      completionRate,
    }
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
  const hunt = await $hunt.findById(huntId)

  if (!hunt) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  return json(await buildHuntResponse(hunt), StatusCodes.OK)
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
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  if (points) {
    await $huntPoint.deleteByHuntId(hunt.id)
    await createHuntPoints(hunt.id, points)
  }

  if (reward) {
    await $huntReward.update(reward.id, {
      topX: reward.topX,
      promoCode: reward.promoCode,
    })
  }

  const response = await buildHuntResponse(hunt)

  if (!response.reward) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  return json(response, StatusCodes.OK)
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
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const response = await buildHuntResponse(hunt)

  if (!response.reward) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  return json(response, StatusCodes.OK)
}
