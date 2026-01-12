import { OpenAPIHono } from "@hono/zod-openapi"
import { HonoContext } from "@lootopia/api/lib/hono"
import { exampleTestRoute, mainTestRoute } from "@lootopia/api/routes/test/doc"
import * as StatusCodes from "stoker/http-status-codes"

const testRouter = new OpenAPIHono<HonoContext>()

testRouter.openapi(mainTestRoute, (c) =>
  c.json({
    message: `Main test route`,
  })
)

testRouter.openapi(exampleTestRoute, (c) =>
  c.json({ message: `Hello ${c.var.user?.name} !` }, StatusCodes.OK)
)

export default testRouter
