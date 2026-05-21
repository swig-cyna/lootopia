import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { paginate } from "@lootopia/api/utils/responses"
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
  deleteHuntPointRoute,
  deleteHuntRewardRoute,
  deleteHuntRoute,
  getHuntRoute,
  getPublishedHuntRoute,
  joinHuntRoute,
  listHuntsRoute,
  listMyHuntsRoute,
  listPublishedHuntsRoute,
  updateHuntRoute,
  validatePointRoute,
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
  const { page, limit } = req.valid("query")

  const [hunts, { count }] = await Promise.all([
    $hunt.findByOrganizer(user.id, page, limit),
    $hunt.countByOrganizer(user.id),
  ])

  const huntIds = hunts.map((hunt) => hunt.id)
  const huntPoints = await $huntPoint.findByHuntIds(huntIds)
  const [huntRewards] = await $huntReward.findByHuntIds(huntIds)

  const huntsWithPoints = hunts.map((hunt) => ({
    ...hunt,
    points: huntPoints.filter((point) => point.huntId === hunt.id),
    reward: huntRewards,
  }))

  return json(
    paginate(huntsWithPoints, Number(count), page, limit),
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

export const getPublishedHuntController: RouteHandler<
  typeof getPublishedHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { id } = req.valid("param")
  const hunt = await $hunt.findById(id)

  if (!hunt || hunt.status !== "published") {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const huntPoints = await $huntPoint.findByHuntIds([hunt.id])

  const quizQuestions = await $quizQuestion.findByHuntPointIds(
    huntPoints.map((point) => point.id),
  )

  const huntPointsWithQuiz = huntPoints.map((point) => {
    const q = quizQuestions.find((quiz) => quiz.huntPointId === point.id)

    return {
      ...point,
      quizQuestion: q
        ? {
            id: q.id,
            huntPointId: q.huntPointId,
            question: q.question,
            answers: q.answers,
          }
        : undefined,
    }
  })

  const [participation, huntReward] = await Promise.all([
    $huntParticipation.findByUserAndHunt(user.id, hunt.id),
    $huntReward.findByHuntIds([hunt.id]),
  ])

  if (!huntReward[0]) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const completedPointIds = participation
    ? (await $huntPointCompletion.findByParticipationId(participation.id)).map(
        (c) => c.huntPointId,
      )
    : []

  return json(
    { ...hunt, points: huntPointsWithQuiz, reward: huntReward[0], completedPointIds },
    StatusCodes.OK,
  )
}

export const updateHuntController: RouteHandler<
  typeof updateHuntRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const { id } = req.valid("param")
  const { title, description, status, points, reward } = req.valid("json")

  const hunt = await $hunt.update(id, { title, description, status })

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

export const deleteHuntPointController: RouteHandler<
  typeof deleteHuntPointRoute,
  AuthenticatedContext
> = async ({ req, body }) => {
  const { id } = req.valid("param")

  await $huntPoint.delete(id)

  return body(null, StatusCodes.NO_CONTENT)
}

export const deleteHuntRewardController: RouteHandler<
  typeof deleteHuntRewardRoute,
  AuthenticatedContext
> = async ({ req, body }) => {
  const { id } = req.valid("param")

  await $huntReward.delete(id)

  return body(null, StatusCodes.NO_CONTENT)
}

export const listPublishedHuntsController: RouteHandler<
  typeof listPublishedHuntsRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { page, limit } = req.valid("query")

  const [hunts, { count }, participations] = await Promise.all([
    $hunt.findPublished(page, limit),
    $hunt.countPublished(),
    $huntParticipation.findByUser(user.id),
  ])

  const joinedHuntIds = new Set(participations.map((p) => p.huntId))

  const huntIds = hunts.map((hunt) => hunt.id)
  const huntPoints =
    huntIds.length > 0 ? await $huntPoint.findByHuntIds(huntIds) : []
  const huntRewards =
    huntIds.length > 0 ? await $huntReward.findByHuntIds(huntIds) : []

  const huntsWithPoints = hunts.map((hunt) => ({
    ...hunt,
    isJoined: joinedHuntIds.has(hunt.id),
    points: huntPoints.filter((point) => point.huntId === hunt.id),
    reward: huntRewards.find((reward) => reward.huntId === hunt.id)!,
  }))

  return json(
    paginate(huntsWithPoints, Number(count), page, limit),
    StatusCodes.OK,
  )
}

export const listMyHuntsController: RouteHandler<
  typeof listMyHuntsRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { page, limit } = req.valid("query")

  const participations = await $huntParticipation.findByUser(user.id)

  if (participations.length === 0) {
    return json(paginate([], 0, page, limit), StatusCodes.OK)
  }

  const huntIds = participations.map((p) => p.huntId)
  const [hunts, huntPoints, huntRewards] = await Promise.all([
    $hunt.findByIds(huntIds),
    $huntPoint.findByHuntIds(huntIds),
    $huntReward.findByHuntIds(huntIds),
  ])

  const huntsWithPoints = hunts.map((hunt) => ({
    ...hunt,
    points: huntPoints.filter((point) => point.huntId === hunt.id),
    reward: huntRewards.find((reward) => reward.huntId === hunt.id)!,
  }))

  return json(
    paginate(huntsWithPoints, participations.length, page, limit),
    StatusCodes.OK,
  )
}

export const validatePointController: RouteHandler<
  typeof validatePointRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { id } = req.valid("param")
  const body = req.valid("json")

  const huntPoint = await $huntPoint.findById(id)

  if (!huntPoint) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const participation = await $huntParticipation.findByUserAndHunt(
    user.id,
    huntPoint.huntId,
  )

  if (!participation) {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const isCorrect = await (async () => {
    if (body.gameType === "quiz") {
      const quiz = await $quizQuestion.findByHuntPointId(id)

      if (!quiz) {
        return false
      }

      return body.selectedAnswerIndex === quiz.correctAnswerIndex
    }

    return true
  })()

  await $huntPointCompletion.create({
    huntParticipationId: participation.id,
    huntPointId: id,
    score: body.score,
  })

  return json({ isCorrect }, StatusCodes.OK)
}

export const joinHuntController: RouteHandler<
  typeof joinHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { id } = req.valid("param")

  const hunt = await $hunt.findById(id)

  if (!hunt || hunt.status !== "published") {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const existing = await $huntParticipation.findByUserAndHunt(user.id, id)

  if (existing) {
    return json({ error: "Already joined this hunt" }, StatusCodes.CONFLICT)
  }

  const participation = await $huntParticipation.create({
    huntId: id,
    userId: user.id,
  })

  return json(participation, StatusCodes.CREATED)
}
