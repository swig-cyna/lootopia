import type { CreateHuntPointInput } from "@lootopia/api/routes/hunts/schema"
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
