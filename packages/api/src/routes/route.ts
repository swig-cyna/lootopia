import { createRouter } from "@lootopia/api/lib/hono"
import huntsRouter from "@lootopia/api/routes/hunts/route"

const router = createRouter()
  .get("/", ({ text }) => text("API Route"))
  .route("/hunts", huntsRouter)

export type AppType = typeof router

export default router
