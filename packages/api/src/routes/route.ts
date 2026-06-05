import { createRouter } from "@lootopia/api/lib/hono"
import adminRouter from "@lootopia/api/routes/admin/route"
import huntsRouter from "@lootopia/api/routes/hunts/route"

const router = createRouter()
  .get("/", ({ text }) => text("API Route"))
  .route("/hunts", huntsRouter)
  .route("/admin", adminRouter)

export type AppType = typeof router

export default router
