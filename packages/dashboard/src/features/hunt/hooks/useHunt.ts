import { api, useQuery } from "@lootopia/dashboard/lib/api"
import type { InferResponseType } from "hono/client"

export type HuntForEdit = Exclude<
  InferResponseType<(typeof api.hunts)[":id"]["$get"]>,
  { error: unknown }
>

export const useHunt = (id: string) => {
  const query = useQuery(api.hunts[":id"], { param: { id } })

  return {
    hunt: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
