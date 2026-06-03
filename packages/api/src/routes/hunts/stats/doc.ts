import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import { requireHuntOwner } from "@lootopia/api/routes/hunts/middlewares"
import { huntIdParamSchema } from "@lootopia/api/routes/hunts/schema"
import {
  huntStatsSchema,
  organizerStatsSchema,
} from "@lootopia/api/routes/hunts/stats/schema"
import {
  createAuthResponses,
  errorResponseSchema,
} from "@lootopia/api/utils/responses"
import { ROLES } from "@lootopia/auth/constants"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"
import { jsonContent } from "stoker/openapi/helpers"

export const getOrganizerStatsRoute = createRoute({
  method: "get",
  path: "/stats",
  tags: ["Hunts"],
  summary: "Get aggregate stats for all own hunts",
  description:
    "Aggregate analytics across every hunt owned by the authenticated organizer.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER])],
  security: [{ bearerAuth: [] }],
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(organizerStatsSchema, "Organizer statistics"),
  }),
})

export const getHuntStatsRoute = createRoute({
  method: "get",
  path: "/{huntId}/stats",
  tags: ["Hunts"],
  summary: "Get stats for a single hunt",
  description:
    "Analytics scoped to a single hunt. Only the owner can read.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner],
  security: [{ bearerAuth: [] }],
  request: {
    params: huntIdParamSchema,
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(huntStatsSchema, "Hunt statistics"),
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
  }),
})
