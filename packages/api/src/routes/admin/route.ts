import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"
import adminHuntsRouter from "@lootopia/api/routes/admin/hunts/route"

const adminRouter = createRouter<AuthenticatedContext>().route(
  "/hunts",
  adminHuntsRouter,
)

export default adminRouter
