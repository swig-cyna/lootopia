import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { HUNT_GAME_TYPE } from "@lootopia/dashboard/features/hunt/utils/constants"
import type { HuntForEdit } from "@lootopia/dashboard/features/hunt/utils/types"

const toFormPoint = (
  point: HuntForEdit["points"][number],
): HuntFormValues["points"][number] => {
  const base = {
    id: point.id,
    latitude: point.latitude,
    longitude: point.longitude,
    position: point.position,
  }

  if (point.gameType === HUNT_GAME_TYPE.QUIZ && point.quizQuestion) {
    return {
      ...base,
      gameType: HUNT_GAME_TYPE.QUIZ,
      quiz: {
        question: point.quizQuestion.question,
        answers: point.quizQuestion.answers,
        correctAnswerIndex: point.quizQuestion.correctAnswerIndex,
      },
    }
  }

  return {
    ...base,
    gameType: HUNT_GAME_TYPE.AR,
    arId: point.arId!,
  }
}

export const huntToFormValues = (hunt: HuntForEdit): HuntFormValues => ({
  title: hunt.title,
  description: hunt.description,
  points: [...hunt.points]
    .sort((a, b) => a.position - b.position)
    .map(toFormPoint),
  reward: {
    topX: hunt.reward.topX,
    promoCode: hunt.reward.promoCode,
  },
})
