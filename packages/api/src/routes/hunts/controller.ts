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
  $quizQuestion,
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

  const huntPoints = await $huntPoint.create(
    points.map((point) => {
      const base = {
        huntId: hunt.id,
        latitude: point.latitude,
        longitude: point.longitude,
        position: point.position,
        gameType: point.gameType,
      }

      if (point.gameType === "ar") {
        return { ...base, arId: point.arId }
      }

      return base
    }),
  )

  const quizPoints = points
    .map((point, i) => ({ point, huntPoint: huntPoints[i] }))
    .filter(
      (entry): entry is typeof entry & { point: { gameType: "quiz" } } =>
        entry.point.gameType === "quiz",
    )

  const quizQuestions =
    quizPoints.length > 0
      ? await $quizQuestion.create(
          quizPoints.map(({ point, huntPoint }) => ({
            huntPointId: huntPoint.id,
            question: point.quiz.question,
            answers: point.quiz.answers,
            correctAnswerIndex: point.quiz.correctAnswerIndex,
          })),
        )
      : []

  const [huntReward] = await $huntReward.create({
    huntId: hunt.id,
    promoCode: reward.promoCode,
    topX: reward.topX,
  })

  const huntPointsWithQuiz = huntPoints.map((huntPoint) => ({
    ...huntPoint,
    quizQuestion: quizQuestions.find((q) => q.huntPointId === huntPoint.id),
  }))

  return json(
    { ...hunt, points: huntPointsWithQuiz, reward: huntReward },
    StatusCodes.CREATED,
  )
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

  const huntPoints = await $huntPoint.findByHuntIds(huntIds)
  const huntRewards = await $huntReward.findByHuntIds(huntIds)
  const participationCounts = await $huntParticipation.countByHuntIds(huntIds)
  const completionCounts = await $huntPointCompletion.countByHuntIds(huntIds)

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
  const { id } = req.valid("param")
  const hunt = await $hunt.findById(id)

  if (!hunt) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const huntPoints = await $huntPoint.findByHuntIds([hunt.id])
  const [huntReward] = await $huntReward.findByHuntIds([hunt.id])

  const quizQuestions = await $quizQuestion.findByHuntPointIds(
    huntPoints.map((point) => point.id),
  )

  const huntPointsWithQuiz = huntPoints.map((point) => ({
    ...point,
    quizQuestion: quizQuestions.find((q) => q.huntPointId === point.id),
  }))

  return json(
    { ...hunt, points: huntPointsWithQuiz, reward: huntReward },
    StatusCodes.OK,
  )
}

export const updateHuntController: RouteHandler<
  typeof updateHuntRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const { id } = req.valid("param")
  const { title, description, status, points, reward } = req.valid("json")

  const hunt = await $hunt.update(id, {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
  })

  if (!hunt) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const huntReward = reward
    ? await $huntReward.update(reward.id, {
        topX: reward.topX,
        promoCode: reward.promoCode,
      })
    : (await $huntReward.findByHuntIds([hunt.id]))[0]

  if (!huntReward) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  if (!points) {
    const huntPoints = await $huntPoint.findByHuntIds([hunt.id])

    return json(
      { ...hunt, points: huntPoints, reward: huntReward },
      StatusCodes.OK,
    )
  }

  await $huntPoint.deleteByHuntId(hunt.id)

  const huntPoints = await $huntPoint.create(
    points.map((point) => {
      const base = {
        huntId: hunt.id,
        latitude: point.latitude,
        longitude: point.longitude,
        position: point.position,
        gameType: point.gameType,
      }

      if (point.gameType === "ar") {
        return { ...base, arId: point.arId }
      }

      return base
    }),
  )

  const quizPoints = points
    .map((point, i) => ({ point, huntPoint: huntPoints[i] }))
    .filter(
      (entry): entry is typeof entry & { point: { gameType: "quiz" } } =>
        entry.point.gameType === "quiz",
    )

  const quizQuestions =
    quizPoints.length > 0
      ? await $quizQuestion.create(
          quizPoints.map(({ point, huntPoint }) => ({
            huntPointId: huntPoint.id,
            question: point.quiz.question,
            answers: point.quiz.answers,
            correctAnswerIndex: point.quiz.correctAnswerIndex,
          })),
        )
      : []

  const huntPointsWithQuiz = huntPoints.map((huntPoint) => ({
    ...huntPoint,
    quizQuestion: quizQuestions.find((q) => q.huntPointId === huntPoint.id),
  }))

  return json(
    { ...hunt, points: huntPointsWithQuiz, reward: huntReward },
    StatusCodes.OK,
  )
}

export const deleteHuntController: RouteHandler<
  typeof deleteHuntRoute,
  AuthenticatedContext
> = async ({ req, body }) => {
  const { id } = req.valid("param")

  await $hunt.delete(id)

  return body(null, StatusCodes.NO_CONTENT)
}

export const updateHuntStatusController: RouteHandler<
  typeof updateHuntStatusRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const { id } = req.valid("param")
  const { status } = req.valid("json")

  const hunt = await $hunt.update(id, { status })

  if (!hunt) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const huntPoints = await $huntPoint.findByHuntIds([hunt.id])
  const [huntReward] = await $huntReward.findByHuntIds([hunt.id])

  if (!huntReward) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const quizQuestions = await $quizQuestion.findByHuntPointIds(
    huntPoints.map((point) => point.id),
  )

  const huntPointsWithQuiz = huntPoints.map((point) => ({
    ...point,
    quizQuestion: quizQuestions.find((q) => q.huntPointId === point.id),
  }))

  return json(
    { ...hunt, points: huntPointsWithQuiz, reward: huntReward },
    StatusCodes.OK,
  )
}
