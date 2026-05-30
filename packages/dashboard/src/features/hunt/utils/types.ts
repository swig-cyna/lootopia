import type { api } from "@lootopia/dashboard/lib/api"
import type { InferResponseType } from "hono"

export type HuntForEdit = Exclude<
  InferResponseType<(typeof api.hunts)[":huntId"]["$get"]>,
  { error: unknown }
>
