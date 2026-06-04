import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"
import {
  getHuntStatsController,
  getOrganizerStatsController,
} from "@lootopia/api/routes/hunts/stats/controller"
import {
  getHuntStatsRoute,
  getOrganizerStatsRoute,
} from "@lootopia/api/routes/hunts/stats/doc"

const statsRouter = createRouter<AuthenticatedContext>()
  .openapi(getOrganizerStatsRoute, getOrganizerStatsController)
  .openapi(getHuntStatsRoute, getHuntStatsController)

export default statsRouter
