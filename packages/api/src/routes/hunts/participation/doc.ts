import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import {
  huntIdParamSchema,
  huntParticipationSchema,
  listHuntsQuerySchema,
  paginatedMyHuntsSchema,
  paginatedPublishedHuntsSchema,
  playerHuntDetailSchema,
} from "@lootopia/api/routes/hunts/schema"
import {
  createAuthResponses,
  errorResponseSchema,
} from "@lootopia/api/utils/responses"
import { ROLES } from "@lootopia/auth/constants"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"
import { jsonContent } from "stoker/openapi/helpers"

export const listPublishedHuntsRoute = createRoute({
  method: "get",
  path: "/published",
  tags: ["Hunts"],
  summary: "List published hunts",
  description:
    "List all published hunts available to join.\n\nRequired roles: player, organizer",
  middleware: [requireRoles([ROLES.PLAYER, ROLES.ORGANIZER])],
  security: [{ bearerAuth: [] }],
  request: {
    query: listHuntsQuerySchema,
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(
      paginatedPublishedHuntsSchema,
      "Paginated list of published hunts",
    ),
  }),
})

export const listMyHuntsRoute = createRoute({
  method: "get",
  path: "/mine",
  tags: ["Hunts"],
  summary: "List my joined hunts",
  description:
    "List hunts the authenticated player has joined.\n\nRequired roles: player, organizer",
  middleware: [requireRoles([ROLES.PLAYER, ROLES.ORGANIZER])],
  security: [{ bearerAuth: [] }],
  request: {
    query: listHuntsQuerySchema,
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(
      paginatedMyHuntsSchema,
      "Paginated list of joined hunts",
    ),
  }),
})

export const getPublishedHuntRoute = createRoute({
  method: "get",
  path: "/published/{huntId}",
  tags: ["Hunts"],
  summary: "Get a published hunt by id",
  description:
    "Get a published hunt by id without quiz answers.\n\nRequired roles: player, organizer",
  middleware: [requireRoles([ROLES.PLAYER, ROLES.ORGANIZER])],
  security: [{ bearerAuth: [] }],
  request: {
    params: huntIdParamSchema,
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(playerHuntDetailSchema, "Hunt found"),
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
  }),
})

export const joinHuntRoute = createRoute({
  method: "post",
  path: "/{huntId}/join",
  tags: ["Hunts"],
  summary: "Join a hunt",
  description: "Join a published hunt as a player.\n\nRequired roles: player",
  middleware: [requireRoles([ROLES.PLAYER])],
  security: [{ bearerAuth: [] }],
  request: {
    params: huntIdParamSchema,
  },
  responses: createAuthResponses({
    [StatusCodes.CREATED]: jsonContent(huntParticipationSchema, "Joined hunt"),
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
    [StatusCodes.CONFLICT]: jsonContent(
      errorResponseSchema,
      "Already joined this hunt",
    ),
  }),
})
