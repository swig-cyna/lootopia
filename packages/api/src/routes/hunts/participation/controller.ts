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
  getPublishedHuntRoute,
  joinHuntRoute,
  listMyHuntsRoute,
  listPublishedHuntsRoute,
} from "@lootopia/api/routes/hunts/participation/doc"

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

export const getPublishedHuntController: RouteHandler<
  typeof getPublishedHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { huntId } = req.valid("param")
  const hunt = await $hunt.findById(huntId)

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

  const completions = participation
    ? await $huntPointCompletion.findByParticipationId(participation.id)
    : []

  const completedPointIds = completions.map((c) => c.huntPointId)
  const totalScore = completions.reduce((sum, c) => sum + c.score, 0)

  return json(
    {
      ...hunt,
      points: huntPointsWithQuiz,
      reward: huntReward[0],
      completedPointIds,
      totalScore,
    },
    StatusCodes.OK,
  )
}

export const joinHuntController: RouteHandler<
  typeof joinHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { huntId } = req.valid("param")

  const hunt = await $hunt.findById(huntId)

  if (!hunt || hunt.status !== "published") {
    return json({ error: "Not Found" }, StatusCodes.NOT_FOUND)
  }

  const existing = await $huntParticipation.findByUserAndHunt(user.id, huntId)

  if (existing) {
    return json({ error: "Already joined this hunt" }, StatusCodes.CONFLICT)
  }

  const participation = await $huntParticipation.create({
    huntId,
    userId: user.id,
  })

  return json(participation, StatusCodes.CREATED)
}
