import { OpenAPIHono, z } from "@hono/zod-openapi"
import * as StatusCodes from "stoker/http-status-codes"
import { jsonContent } from "stoker/openapi/helpers"

const testRouter = new OpenAPIHono()

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
      return c.json({ message: "Main test route" })
    }
  )
  .openapi(
    {
      method: "get",
      path: "/example",
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
      if (c.req.header("Authorization") === "Bearer test") {
        return c.json({ message: "Test example route" }, StatusCodes.OK)
      }

      return c.json(
        { message: "Test unauthorized example route" },
        StatusCodes.UNAUTHORIZED
      )
    }
  )

export default testRouter
