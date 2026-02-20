import { OpenAPIHono } from "@hono/zod-openapi"
import { HonoContext } from "@lootopia/api/lib/hono"
import huntsRouter from "@lootopia/api/routes/hunts/route"
import testRouter from "@lootopia/api/routes/test/route"

const router = new OpenAPIHono<HonoContext>()

router.get("/", (c) => c.text("API Route"))

router.route("/test", testRouter)
router.route("/hunts", huntsRouter)

export default router
