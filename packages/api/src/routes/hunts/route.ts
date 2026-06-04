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
import participationRouter from "@lootopia/api/routes/hunts/participation/route"
import pointsRouter from "@lootopia/api/routes/hunts/points/route"
import statsRouter from "@lootopia/api/routes/hunts/stats/route"

const huntsRouter = createRouter<AuthenticatedContext>()
  .openapi(createHuntRoute, createHuntController)
  .openapi(listHuntsRoute, listHuntsController)
  .route("/", participationRouter)
  .route("/", pointsRouter)
  .route("/", statsRouter)
  .openapi(getHuntRoute, getHuntController)
  .openapi(updateHuntRoute, updateHuntController)
  .openapi(deleteHuntRoute, deleteHuntController)
  .openapi(updateHuntStatusRoute, updateHuntStatusController)

export default huntsRouter
