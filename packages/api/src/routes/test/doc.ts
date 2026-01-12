import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import { messageResponseSchema } from "@lootopia/api/routes/test/schema"
import { ROLES } from "@lootopia/api/utils/constants"
import { createAuthResponses } from "@lootopia/api/utils/responses"
import * as StatusCodes from "stoker/http-status-codes"
import { jsonContent } from "stoker/openapi/helpers"

export const mainTestRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Test"],
  summary: "Main test route",
  description: "Simple route to test the API is working",
  responses: {
    [StatusCodes.OK]: jsonContent(messageResponseSchema, "Main test route"),
  },
})

export const exampleTestRoute = createRoute({
  method: "get",
  path: "/example",
  tags: ["Test"],
  summary: "Protected test route",
  description: "Test route requiring authentication\n\nRequired roles: user",
  middleware: [requireRoles([ROLES.USER])],
  security: [{ bearerAuth: [] }],
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(
      messageResponseSchema,
      "Successful authenticated response"
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(messageResponseSchema, "Not found"),
  }),
})
