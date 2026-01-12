import { OpenAPIHono } from "@hono/zod-openapi"
import { HonoContext } from "@lootopia/api/lib/hono"
import testRouter from "@lootopia/api/routes/test/route"

const router = new OpenAPIHono<HonoContext>()

router.get("/", (c) => {
  return c.text("API Route")
})

router.route("/test", testRouter)

export default router
