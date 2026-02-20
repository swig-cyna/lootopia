import { createRouter } from "@lootopia/api/lib/hono"
import huntsRouter from "@lootopia/api/routes/hunts/route"

const router = createRouter()

router.get("/", (c) => c.text("API Route"))
router.route("/hunts", huntsRouter)

export default router
