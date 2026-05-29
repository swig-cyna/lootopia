import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { paginate } from "@lootopia/api/utils/responses"
import { HUNT_STATUS } from "@lootopia/common/constants/hunt"
import { $huntParticipation } from "@lootopia/db/repositories/hunt-participation.repository"
import { $huntPointCompletion } from "@lootopia/db/repositories/hunt-point-completion.repository"
import { $hunt } from "@lootopia/db/repositories/hunt.repository"
import { type QuizQuestion } from "@lootopia/db/repositories/quiz-question.repository"
import { paginateQuery } from "@lootopia/db/utils"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

import type {
  getPublishedHuntRoute,
  joinHuntRoute,
  listMyHuntsRoute,
  listPublishedHuntsRoute,
} from "@lootopia/api/routes/hunts/participation/doc"

const toPlayerQuizQuestion = (
  quizQuestion: QuizQuestion | null | undefined,
) => {
  if (!quizQuestion) {
    return undefined
  }

  return {
    id: quizQuestion.id,
    huntPointId: quizQuestion.huntPointId,
    question: quizQuestion.question,
    answers: quizQuestion.answers,
  }
}

export const listPublishedHuntsController: RouteHandler<
  typeof listPublishedHuntsRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { page, limit } = req.valid("query")

  const { result: hunts, count } = await paginateQuery(
    $hunt.findPublished(user.id),
    { pageSize: limit, pageIndex: page - 1 },
    "id",
  )

  const result = hunts.map((hunt) => ({
    ...hunt,
    isJoined: hunt.participation !== null,
  }))

  return json(paginate(result, Number(count), page, limit), StatusCodes.OK)
}

export const listMyHuntsController: RouteHandler<
  typeof listMyHuntsRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { page, limit } = req.valid("query")

  const { result: hunts, count } = await paginateQuery(
    $hunt.byJoinedByUser(user.id),
    { pageSize: limit, pageIndex: page - 1 },
    "hunts.id",
  )

  return json(paginate(hunts, Number(count), page, limit), StatusCodes.OK)
}

export const getPublishedHuntController: RouteHandler<
  typeof getPublishedHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { huntId } = req.valid("param")

  const [huntWithDetails, participation] = await Promise.all([
    $hunt.byIdWithDetails(huntId),
    $huntParticipation.byUserAndHunt(user.id, huntId),
  ])

  if (!huntWithDetails || huntWithDetails.status !== HUNT_STATUS.PUBLISHED) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  if (!huntWithDetails.reward) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  const completions = participation
    ? await $huntPointCompletion.byParticipationId(participation.id).execute()
    : []

  const completedPointIds = completions.map((c) => c.huntPointId)
  const totalScore = completions.reduce((sum, c) => sum + c.score, 0)

  return json(
    {
      ...huntWithDetails,
      points: huntWithDetails.points.map(({ quizQuestion, ...point }) => ({
        ...point,
        quizQuestion: toPlayerQuizQuestion(quizQuestion),
      })),
      completedPointIds,
      totalScore,
      isJoined: Boolean(participation),
    },
    StatusCodes.OK,
  )
}

export const joinHuntController: RouteHandler<
  typeof joinHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { huntId } = req.valid("param")

  const hunt = await $hunt.byId(huntId)

  if (!hunt || hunt.status !== HUNT_STATUS.PUBLISHED) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  const existing = await $huntParticipation.byUserAndHunt(user.id, huntId)

  if (existing) {
    return json({ error: "Already joined this hunt" }, StatusCodes.CONFLICT)
  }

  const participation = await $huntParticipation.create({
    huntId,
    userId: user.id,
  })

  return json(participation, StatusCodes.CREATED)
}
