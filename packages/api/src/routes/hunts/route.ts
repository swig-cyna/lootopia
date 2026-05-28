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
import {
  deleteHuntPointController,
  validatePointController,
} from "@lootopia/api/routes/hunts/points/controller"
import {
  deleteHuntPointRoute,
  validatePointRoute,
} from "@lootopia/api/routes/hunts/points/doc"
import {
  getPublishedHuntController,
  joinHuntController,
  listMyHuntsController,
  listPublishedHuntsController,
} from "@lootopia/api/routes/hunts/participation/controller"
import {
  getPublishedHuntRoute,
  joinHuntRoute,
  listMyHuntsRoute,
  listPublishedHuntsRoute,
} from "@lootopia/api/routes/hunts/participation/doc"
import { deleteHuntRewardController } from "@lootopia/api/routes/hunts/rewards/controller"
import { deleteHuntRewardRoute } from "@lootopia/api/routes/hunts/rewards/doc"

const huntsRouter = createRouter<AuthenticatedContext>()
  .openapi(createHuntRoute, createHuntController)
  .openapi(listHuntsRoute, listHuntsController)
  .openapi(getHuntRoute, getHuntController)
  .openapi(updateHuntRoute, updateHuntController)
  .openapi(deleteHuntRoute, deleteHuntController)
  .openapi(updateHuntStatusRoute, updateHuntStatusController)
  .openapi(listPublishedHuntsRoute, listPublishedHuntsController)
  .openapi(listMyHuntsRoute, listMyHuntsController)
  .openapi(getPublishedHuntRoute, getPublishedHuntController)
  .openapi(joinHuntRoute, joinHuntController)
  .openapi(validatePointRoute, validatePointController)
  .openapi(deleteHuntPointRoute, deleteHuntPointController)
  .openapi(deleteHuntRewardRoute, deleteHuntRewardController)

export default huntsRouter
