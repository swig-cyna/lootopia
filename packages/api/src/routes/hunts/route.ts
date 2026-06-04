import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"
import {
  createHuntController,
  deleteHuntController,
  getHuntController,
  listHuntsController,
  updateHuntController,
  updateHuntStatusController,
} from "@lootopia/api/routes/hunts/controller"
import {
  createHuntRoute,
  deleteHuntRoute,
  getHuntRoute,
  listHuntsRoute,
  updateHuntRoute,
  updateHuntStatusRoute,
} from "@lootopia/api/routes/hunts/doc"
import leaderboardRouter from "@lootopia/api/routes/hunts/leaderboard/route"
import participationRouter from "@lootopia/api/routes/hunts/participation/route"
import pointsRouter from "@lootopia/api/routes/hunts/points/route"
import {
  getHuntStatsController,
  getOrganizerStatsController,
} from "@lootopia/api/routes/hunts/stats/controller"
import {
  getHuntStatsRoute,
  getOrganizerStatsRoute,
} from "@lootopia/api/routes/hunts/stats/doc"

const huntsRouter = createRouter<AuthenticatedContext>()
  .openapi(createHuntRoute, createHuntController)
  .openapi(listHuntsRoute, listHuntsController)
  .openapi(getOrganizerStatsRoute, getOrganizerStatsController)
  .route("/", participationRouter)
  .route("/", pointsRouter)
  .route("/", leaderboardRouter)
  .openapi(getHuntStatsRoute, getHuntStatsController)
  .openapi(getHuntRoute, getHuntController)
  .openapi(updateHuntRoute, updateHuntController)
  .openapi(deleteHuntRoute, deleteHuntController)
  .openapi(updateHuntStatusRoute, updateHuntStatusController)

export default huntsRouter
