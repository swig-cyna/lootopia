import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import {
  adminHuntsResponseSchema,
  listAllHuntsQuerySchema,
} from "@lootopia/api/routes/admin/hunts/schema"
import {
  huntIdParamSchema,
  huntSchema,
  updateHuntStatusSchema,
} from "@lootopia/api/routes/hunts/schema"
import {
  createAuthResponses,
  errorResponseSchema,
} from "@lootopia/api/utils/responses"
import { ROLES } from "@lootopia/auth/constants"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"
import { jsonContent } from "stoker/openapi/helpers"

export const listAllHuntsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Admin"],
  summary: "List all hunts",
  description:
    "List every hunt on the platform with pagination.\n\nRequired roles: admin",
  middleware: [requireRoles([ROLES.ADMIN])],
  security: [{ bearerAuth: [] }],
  request: {
    query: listAllHuntsQuerySchema,
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(
      adminHuntsResponseSchema,
      "Paginated list of all hunts",
    ),
  }),
})

export const adminUpdateHuntStatusRoute = createRoute({
  method: "patch",
  path: "/{huntId}/status",
  tags: ["Admin"],
  summary: "Update any hunt status",
  description:
    "Publish or unpublish any hunt regardless of its owner.\n\nRequired roles: admin",
  middleware: [requireRoles([ROLES.ADMIN])],
  security: [{ bearerAuth: [] }],
  request: {
    params: huntIdParamSchema,
    body: jsonContent(updateHuntStatusSchema, "Hunt status update payload"),
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(huntSchema, "Hunt status updated"),
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
  }),
})

export const adminDeleteHuntRoute = createRoute({
  method: "delete",
  path: "/{huntId}",
  tags: ["Admin"],
  summary: "Delete any hunt",
  description:
    "Delete any hunt regardless of its owner.\n\nRequired roles: admin",
  middleware: [requireRoles([ROLES.ADMIN])],
  security: [{ bearerAuth: [] }],
  request: {
    params: huntIdParamSchema,
  },
  responses: createAuthResponses({
    [StatusCodes.NO_CONTENT]: { description: "Hunt deleted" },
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
  }),
})
