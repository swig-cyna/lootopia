import type { HuntGameType } from "@lootopia/dashboard/features/hunt/utils/constants"
import type { api } from "@lootopia/dashboard/lib/api"
import type { InferResponseType } from "hono"
import type { Marker } from "mapbox-gl"

export interface HuntPoint {
  id: string
  lng: number
  lat: number
  gameType: HuntGameType
  marker: Marker
}

export type HuntForEdit = Exclude<
  InferResponseType<(typeof api.hunts)[":huntId"]["$get"]>,
  { error: unknown }
>
