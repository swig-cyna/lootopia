import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { MAX_AR_SCORE } from "@lootopia/common/constants/hunt"
import {
  $huntParticipation,
  $huntPoint,
  $huntPointCompletion,
  $quizQuestion,
} from "@lootopia/db/repositories/hunt.repository"
import * as StatusCodes from "stoker/http-status-codes"

import type {
  deleteHuntPointRoute,
  validatePointRoute,
} from "@lootopia/api/routes/hunts/points/doc"

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

  const [allHuntPoints, completions] = await Promise.all([
    $huntPoint.findByHuntIds([huntPoint.huntId]),
    $huntPointCompletion.findByParticipationId(participation.id),
  ])

  const completedPointIds = new Set(completions.map((c) => c.huntPointId))

  if (completedPointIds.has(id)) {
    return json({ error: "Point already completed" }, StatusCodes.CONFLICT)
  }

  const previousPoints = allHuntPoints.filter(
    (p) => p.position < huntPoint.position,
  )
  const allPreviousCompleted = previousPoints.every((p) =>
    completedPointIds.has(p.id),
  )

  if (!allPreviousCompleted) {
    return json(
      { error: "Previous points must be completed first" },
      StatusCodes.FORBIDDEN,
    )
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

  const finalScore = isCorrect ? Math.min(body.score, MAX_AR_SCORE) : 0

  await $huntPointCompletion.create({
    huntParticipationId: participation.id,
    huntPointId: id,
    score: finalScore,
  })

  return json({ isCorrect }, StatusCodes.OK)
}

export const deleteHuntPointController: RouteHandler<
  typeof deleteHuntPointRoute,
  AuthenticatedContext
> = async ({ req, body }) => {
  const { pointId } = req.valid("param")

  await $huntPoint.delete(pointId)

  return body(null, StatusCodes.NO_CONTENT)
}
