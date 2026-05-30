import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { HUNT_GAME_TYPE, MAX_AR_SCORE } from "@lootopia/common/constants/hunt"
import { $huntParticipation } from "@lootopia/db/repositories/hunt-participation.repository"
import { $huntPointCompletion } from "@lootopia/db/repositories/hunt-point-completion.repository"
import { $huntPoint } from "@lootopia/db/repositories/hunt-point.repository"
import { $quizQuestion } from "@lootopia/db/repositories/quiz-question.repository"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

import type { validatePointRoute } from "@lootopia/api/routes/hunts/points/doc"

export const validatePointController: RouteHandler<
  typeof validatePointRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { id } = req.valid("param")
  const body = req.valid("json")

  const huntPoint = await $huntPoint.byId(id)

  if (!huntPoint) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  const participation = await $huntParticipation.byUserAndHunt(
    user.id,
    huntPoint.huntId,
  )

  if (!participation) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  const [allHuntPoints, completions] = await Promise.all([
    $huntPoint.byHuntIds([huntPoint.huntId]),
    $huntPointCompletion.byParticipationId(participation.id).execute(),
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
    if (body.gameType === HUNT_GAME_TYPE.QUIZ) {
      const quiz = await $quizQuestion.byHuntPointId(id)

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
