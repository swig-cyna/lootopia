import type { CreateHuntPointInput } from "@lootopia/api/routes/hunts/schema"
import {
  type Hunt,
  $huntPoint,
  $huntReward,
  $quizQuestion,
} from "@lootopia/db/repositories/hunt.repository"

export const buildHuntResponse = async (hunt: Hunt) => {
  const [huntPoints, huntRewards] = await Promise.all([
    $huntPoint.findByHuntIds([hunt.id]),
    $huntReward.findByHuntIds([hunt.id]),
  ])

  const quizQuestions = await $quizQuestion.findByHuntPointIds(
    huntPoints.map((p) => p.id),
  )

  const points = huntPoints.map((point) => ({
    ...point,
    quizQuestion: quizQuestions.find((q) => q.huntPointId === point.id),
  }))

  return { ...hunt, points, reward: huntRewards[0] }
}

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

  if (quizPoints.length > 0) {
    await $quizQuestion.create(
      quizPoints.map(({ point, huntPoint }) => ({
        huntPointId: huntPoint.id,
        question: point.quiz.question,
        answers: point.quiz.answers,
        correctAnswerIndex: point.quiz.correctAnswerIndex,
      })),
    )
  }

  return huntPoints
}
