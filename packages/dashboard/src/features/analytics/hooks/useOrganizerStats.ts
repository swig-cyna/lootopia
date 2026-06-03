import { api, useQuery } from "@lootopia/dashboard/lib/api"

export const useOrganizerStats = () => useQuery(api.hunts.stats)
