import type { HuntGameType } from "@lootopia/dashboard/features/hunt/utils/constants"
import type { Marker } from "mapbox-gl"

export interface HuntPoint {
  id: string
  lng: number
  lat: number
  gameType: HuntGameType
  marker: Marker
}
