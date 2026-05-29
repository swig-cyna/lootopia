import { HUNT_GAME_TYPE } from "@lootopia/common/constants/hunt"
import type { $hunt } from "@lootopia/db/repositories/hunt.repository"

export type HuntWithDetails = NonNullable<
  Awaited<ReturnType<typeof $hunt.byIdWithDetails>>
>
type DbPoint = HuntWithDetails["points"][number]
type BasePoint = Pick<DbPoint, "id" | "latitude" | "longitude" | "position">

export const mapPointSummary = (point: BasePoint) => ({
  id: point.id,
  latitude: point.latitude,
  longitude: point.longitude,
  position: point.position,
})

export const mapPointDetail = (point: DbPoint) => {
  const base = mapPointSummary(point)

  if (point.gameType === HUNT_GAME_TYPE.QUIZ && point.quizQuestion) {
    return {
      ...base,
      game: {
        type: HUNT_GAME_TYPE.QUIZ,
        quiz: {
          question: point.quizQuestion.question,
          answers: point.quizQuestion.answers,
          correctIndex: point.quizQuestion.correctAnswerIndex,
        },
      },
    }
  }

  return { ...base, game: { type: HUNT_GAME_TYPE.AR, arId: point.arId! } }
}

export const mapPointDetailPlayer = (point: DbPoint) => {
  const base = mapPointSummary(point)

  if (point.gameType === HUNT_GAME_TYPE.QUIZ && point.quizQuestion) {
    return {
      ...base,
      game: {
        type: HUNT_GAME_TYPE.QUIZ,
        quiz: {
          question: point.quizQuestion.question,
          answers: point.quizQuestion.answers,
        },
      },
    }
  }

  return { ...base, game: { type: HUNT_GAME_TYPE.AR, arId: point.arId! } }
}

export const mapHuntDetail = (hunt: HuntWithDetails) => ({
  ...hunt,
  points: hunt.points.map(mapPointDetail),
})

export const mapHuntDetailPlayer = (hunt: HuntWithDetails) => {
  // eslint-disable-next-line no-unused-vars
  const { reward: _reward, ...rest } = hunt

  return { ...rest, points: hunt.points.map(mapPointDetailPlayer) }
}
