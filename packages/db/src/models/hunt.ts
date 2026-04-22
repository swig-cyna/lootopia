import type { Generated } from "kysely"
import type { Timestamp } from "../schema"

// Use Timestamp directly (not wrapped in Generated) for columns with DB defaults.
// Generated<T> is for non-ColumnType types only (e.g. Generated<boolean>, Generated<HuntStatus>).

export const HUNT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const

export type HuntStatus = (typeof HUNT_STATUS)[keyof typeof HUNT_STATUS]

export const HUNT_GAME_TYPE = {
  QUIZ: "quiz",
  AR: "ar",
} as const

export type HuntGameType = (typeof HUNT_GAME_TYPE)[keyof typeof HUNT_GAME_TYPE]

export interface HuntTable {
  id: Generated<string>
  title: string
  description: string
  status: Generated<HuntStatus>
  organizerId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface HuntPointTable {
  id: Generated<string>
  huntId: string
  latitude: number
  longitude: number
  gameType: HuntGameType
  createdAt: Timestamp
  position: number
}

export interface HuntRewardTable {
  id: Generated<string>
  huntId: string
  topX: number
  promoCode: string
}

export interface QuizQuestionTable {
  id: Generated<string>
  huntPointId: string
  question: string
  answers: string[]
  correctAnswerIndex: number
}
