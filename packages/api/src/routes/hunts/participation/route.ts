import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"
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

const participationRouter = createRouter<AuthenticatedContext>()
  .openapi(listPublishedHuntsRoute, listPublishedHuntsController)
  .openapi(listMyHuntsRoute, listMyHuntsController)
  .openapi(getPublishedHuntRoute, getPublishedHuntController)
  .openapi(joinHuntRoute, joinHuntController)

export default participationRouter
