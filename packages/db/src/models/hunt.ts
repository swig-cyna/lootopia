import type { Generated, JSONColumnType } from "kysely"
import type {
  ArGameId,
  HuntGameType,
  HuntSort,
  HuntStatus,
} from "@lootopia/common/constants/hunt"
import type { Timestamp } from "../schema"

// Use Timestamp directly (not wrapped in Generated) for columns with DB defaults.
// Generated<T> is for non-ColumnType types only (e.g. Generated<boolean>, Generated<HuntStatus>).

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
  arId: ArGameId | null
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
  answers: JSONColumnType<string[]>
  correctAnswerIndex: number
}

export interface HuntParticipationTable {
  id: Generated<string>
  huntId: string
  userId: string
  joinedAt: Timestamp
}

export interface HuntPointCompletionTable {
  id: Generated<string>
  huntParticipationId: string
  huntPointId: string
  score: number
  completedAt: Timestamp
}

export interface ListOrganizerHuntsOptions {
  status?: HuntStatus
  search?: string
  sort?: HuntSort
}
