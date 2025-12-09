import { OpenAPIHono } from "@hono/zod-openapi"
import testRouter from "./test/route.ts"

const router = new OpenAPIHono()

router.get("/", (c) => {
  return c.text("API Route")
})

router.route("/test", testRouter)

export default router
