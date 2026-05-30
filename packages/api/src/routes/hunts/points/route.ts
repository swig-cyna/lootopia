import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { validatePointController } from "@lootopia/api/routes/hunts/points/controller"
import { validatePointRoute } from "@lootopia/api/routes/hunts/points/doc"

const pointsRouter = createRouter<AuthenticatedContext>().openapi(
  validatePointRoute,
  validatePointController,
)

export default pointsRouter
