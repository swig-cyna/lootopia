import { api, useQuery } from "@lootopia/dashboard/lib/api"

export const useHuntStats = (huntId: string) =>
  useQuery(api.hunts[":huntId"].stats, { param: { huntId } })
