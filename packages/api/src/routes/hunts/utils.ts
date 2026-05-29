import type {
  CreateHuntPointInput,
  UpdateHuntPointInput,
} from "@lootopia/api/routes/hunts/schema"
import { HUNT_GAME_TYPE } from "@lootopia/common/constants/hunt"
import { $huntPoint } from "@lootopia/db/repositories/hunt-point.repository"
import { $quizQuestion } from "@lootopia/db/repositories/quiz-question.repository"

export const createHuntPoints = async (
  huntId: string,
  points: CreateHuntPointInput[],
) => {
  const huntPoints = await $huntPoint.create(
    points.map((point) => {
      const base = {
        huntId,
        latitude: point.latitude,
        longitude: point.longitude,
        position: point.position,
        gameType: point.gameType,
      }

      if (point.gameType === HUNT_GAME_TYPE.AR) {
        return { ...base, arId: point.arId }
      }

      return base
    }),
  )

  const quizQuestions = huntPoints.flatMap((huntPoint, i) => {
    const point = points[i]

    if (point.gameType !== HUNT_GAME_TYPE.QUIZ) {
      return []
    }

    return [
      {
        huntPointId: huntPoint.id,
        question: point.quiz.question,
        answers: point.quiz.answers,
        correctAnswerIndex: point.quiz.correctAnswerIndex,
      },
    ]
  })

  if (quizQuestions.length > 0) {
    await $quizQuestion.create(quizQuestions)
  }

  return huntPoints
}

const updateExistingHuntPoint = async (
  point: UpdateHuntPointInput & { id: string },
) => {
  const arId = point.gameType === HUNT_GAME_TYPE.AR ? point.arId : null

  await $huntPoint.update(point.id, {
    latitude: point.latitude,
    longitude: point.longitude,
    position: point.position,
    gameType: point.gameType,
    arId,
  })

  if (point.gameType === HUNT_GAME_TYPE.QUIZ) {
    const existing = await $quizQuestion.byHuntPointId(point.id)

    if (existing) {
      await $quizQuestion.update(existing.id, {
        question: point.quiz.question,
        answers: point.quiz.answers,
        correctAnswerIndex: point.quiz.correctAnswerIndex,
      })

      return
    }

    await $quizQuestion.create([
      {
        huntPointId: point.id,
        question: point.quiz.question,
        answers: point.quiz.answers,
        correctAnswerIndex: point.quiz.correctAnswerIndex,
      },
    ])

    return
  }

  const existing = await $quizQuestion.byHuntPointId(point.id)

  if (existing) {
    await $quizQuestion.delete(existing.id)
  }
}

export const syncHuntPoints = async (
  huntId: string,
  points: UpdateHuntPointInput[],
) => {
  const existingPoints = await $huntPoint.byHuntIds([huntId])
  const incomingIds = new Set(
    points.filter((p) => p.id !== undefined).map((p) => p.id!),
  )

  const toDelete = existingPoints.filter((p) => !incomingIds.has(p.id))
  const toUpdate = points.filter(
    (p): p is UpdateHuntPointInput & { id: string } => p.id !== undefined,
  )
  const toCreate = points.filter((p) => p.id === undefined)

  await Promise.all([
    ...toDelete.map((p) => $huntPoint.delete(p.id)),
    ...toUpdate.map(updateExistingHuntPoint),
    toCreate.length > 0
      ? createHuntPoints(huntId, toCreate as CreateHuntPointInput[])
      : undefined,
  ])
}
