import type { Generated } from "kysely"
import type { Timestamp } from "../schema"

export const HUNT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const

export type HuntStatus = (typeof HUNT_STATUS)[keyof typeof HUNT_STATUS]

export interface HuntTable {
  id: string
  title: string
  description: string
  status: Generated<HuntStatus>
  organizerId: string
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
}

export interface HuntPointTable {
  id: string
  huntId: string
  latitude: number
  longitude: number
  gameType: string
  createdAt: Generated<Timestamp>
}

export interface HuntRewardTable {
  id: string
  huntId: string
  topX: number
  promoCode: string
}

export interface QuizQuestionTable {
  id: string
  huntPointId: string
  question: string
  answers: unknown
  correctAnswerIndex: number
}
