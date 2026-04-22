import type { QuizQuestionValues } from "@lootopia/dashboard/features/hunt/components/QuizQuestionDialog"
import type { HuntGameType } from "@lootopia/dashboard/features/hunt/utils/constant.ts"
import type { Marker } from "mapbox-gl"

export interface HuntPoint {
  id: string
  lng: number
  lat: number
  gameType: HuntGameType
  quizQuestion?: QuizQuestionValues
  marker: Marker
}
