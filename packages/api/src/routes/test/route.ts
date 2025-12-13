import { OpenAPIHono, z } from "@hono/zod-openapi"
import { HonoContext } from "@lootopia/api/lib/hono"
import { loggedInMiddleware } from "@lootopia/api/middlewares/auth.middlewares"
import * as StatusCodes from "stoker/http-status-codes"
import { jsonContent } from "stoker/openapi/helpers"

const testRouter = new OpenAPIHono<HonoContext>()

testRouter
  .openapi(
    {
      method: "get",
      path: "/",
      responses: {
        [StatusCodes.OK]: jsonContent(
          z.object({
            message: z.string(),
          }),
          "Main test route"
        ),
      },
    },
    (c) => {
      return c.json({
        message: `Main test route`,
      })
    }
  )
  .openapi(
    {
      method: "get",
      path: "/example",
      middleware: loggedInMiddleware,
      responses: {
        [StatusCodes.OK]: jsonContent(
          z.object({
            message: z.string(),
          }),
          "Test example route"
        ),
        [StatusCodes.UNAUTHORIZED]: jsonContent(
          z.object({
            message: z.string(),
          }),
          "Test unauthorized example route"
        ),
      },
    },
    (c) => {
      return c.json(
        { message: `Hello ${c.var.user?.name} !` },
        StatusCodes.UNAUTHORIZED
      )
    }
  )

export default testRouter
