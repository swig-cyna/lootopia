import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"

import {
  createHuntController,
  deleteHuntController,
  deleteHuntPointController,
  deleteHuntRewardController,
  getHuntController,
  joinHuntController,
  listHuntsController,
  listMyHuntsController,
  listPublishedHuntsController,
  updateHuntController,
} from "@lootopia/api/routes/hunts/controller"
import {
  createHuntRoute,
  deleteHuntPointRoute,
  deleteHuntRewardRoute,
  deleteHuntRoute,
  getHuntRoute,
  joinHuntRoute,
  listHuntsRoute,
  listMyHuntsRoute,
  listPublishedHuntsRoute,
  updateHuntRoute,
} from "@lootopia/api/routes/hunts/doc"

const huntsRouter = createRouter<AuthenticatedContext>()
  .openapi(createHuntRoute, createHuntController)
  .openapi(listHuntsRoute, listHuntsController)
  .openapi(listPublishedHuntsRoute, listPublishedHuntsController)
  .openapi(listMyHuntsRoute, listMyHuntsController)
  .openapi(getHuntRoute, getHuntController)
  .openapi(updateHuntRoute, updateHuntController)
  .openapi(deleteHuntRoute, deleteHuntController)
  .openapi(joinHuntRoute, joinHuntController)
  .openapi(deleteHuntPointRoute, deleteHuntPointController)
  .openapi(deleteHuntRewardRoute, deleteHuntRewardController)

export default huntsRouter
