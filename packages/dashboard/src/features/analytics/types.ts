import { api } from "@lootopia/dashboard/lib/api"
import type { InferResponseType } from "hono/client"

export type OrganizerStats = Exclude<
  InferResponseType<typeof api.hunts.stats.$get>,
  { error: unknown }
>

export type HuntStats = Exclude<
  InferResponseType<(typeof api.hunts)[":huntId"]["stats"]["$get"]>,
  { error: unknown }
>

export type RegistrationPoint = OrganizerStats["registrations"][number]
export type TopHunt = OrganizerStats["topHunts"][number]
export type PointFunnelEntry = HuntStats["pointFunnel"][number]
