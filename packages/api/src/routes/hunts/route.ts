import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"

import {
  createHuntController,
  deleteHuntController,
  deleteHuntPointController,
  deleteHuntRewardController,
  getHuntController,
  getPublishedHuntController,
  joinHuntController,
  listHuntsController,
  listMyHuntsController,
  listPublishedHuntsController,
  updateHuntController,
  updateHuntStatusController,
  validatePointController,
} from "@lootopia/api/routes/hunts/controller"
import {
  createHuntRoute,
  deleteHuntPointRoute,
  deleteHuntRewardRoute,
  deleteHuntRoute,
  getHuntRoute,
  getPublishedHuntRoute,
  joinHuntRoute,
  listHuntsRoute,
  listMyHuntsRoute,
  listPublishedHuntsRoute,
  updateHuntRoute,
  updateHuntStatusRoute,
  validatePointRoute,
} from "@lootopia/api/routes/hunts/doc"

const huntsRouter = createRouter<AuthenticatedContext>()
  .openapi(createHuntRoute, createHuntController)
  .openapi(listHuntsRoute, listHuntsController)
  .openapi(listPublishedHuntsRoute, listPublishedHuntsController)
  .openapi(listMyHuntsRoute, listMyHuntsController)
  .openapi(getHuntRoute, getHuntController)
  .openapi(getPublishedHuntRoute, getPublishedHuntController)
  .openapi(validatePointRoute, validatePointController)
  .openapi(updateHuntRoute, updateHuntController)
  .openapi(deleteHuntRoute, deleteHuntController)
  .openapi(joinHuntRoute, joinHuntController)
  .openapi(deleteHuntPointRoute, deleteHuntPointController)
  .openapi(deleteHuntRewardRoute, deleteHuntRewardController)
  .openapi(updateHuntStatusRoute, updateHuntStatusController)

export default huntsRouter
