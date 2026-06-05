import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"
import {
  adminDeleteHuntController,
  adminUpdateHuntStatusController,
  listAllHuntsController,
} from "@lootopia/api/routes/admin/hunts/controller"
import {
  adminDeleteHuntRoute,
  adminUpdateHuntStatusRoute,
  listAllHuntsRoute,
} from "@lootopia/api/routes/admin/hunts/doc"

const adminHuntsRouter = createRouter<AuthenticatedContext>()
  .openapi(listAllHuntsRoute, listAllHuntsController)
  .openapi(adminUpdateHuntStatusRoute, adminUpdateHuntStatusController)
  .openapi(adminDeleteHuntRoute, adminDeleteHuntController)

export default adminHuntsRouter
