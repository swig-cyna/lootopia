import { OpenAPIHono } from "@hono/zod-openapi"
import testRouter from "@lootopia/api/routes/test/route"
import { HonoContext } from "../lib/hono"

const router = new OpenAPIHono<HonoContext>()

router.get("/", (c) => {
  return c.text("API Route")
})

router.route("/test", testRouter)

export default router
