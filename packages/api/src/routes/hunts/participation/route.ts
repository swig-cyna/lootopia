import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"
import {
  claimRewardController,
  getPublishedHuntController,
  joinHuntController,
  listMyHuntsController,
  listPublishedHuntsController,
} from "@lootopia/api/routes/hunts/participation/controller"
import {
  claimRewardRoute,
  getPublishedHuntRoute,
  joinHuntRoute,
  listMyHuntsRoute,
  listPublishedHuntsRoute,
} from "@lootopia/api/routes/hunts/participation/doc"

const participationRouter = createRouter<AuthenticatedContext>()
  .openapi(listPublishedHuntsRoute, listPublishedHuntsController)
  .openapi(listMyHuntsRoute, listMyHuntsController)
  .openapi(getPublishedHuntRoute, getPublishedHuntController)
  .openapi(joinHuntRoute, joinHuntController)
  .openapi(claimRewardRoute, claimRewardController)

export default participationRouter
