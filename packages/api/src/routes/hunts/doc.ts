import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import { requireHuntOwner } from "@lootopia/api/routes/hunts/middlewares"
import {
  createHuntSchema,
  huntParticipationSchema,
  huntSchema,
  listHuntsQuerySchema,
  paginatedHuntsSchema,
  paginatedMyHuntsSchema,
  paginatedPublishedHuntsSchema,
  updateHuntSchema,
} from "@lootopia/api/routes/hunts/schema"
import {
  createAuthResponses,
  errorResponseSchema,
  idParamSchema,
} from "@lootopia/api/utils/responses"
import { ROLES } from "@lootopia/auth/constants"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"
import { jsonContent } from "stoker/openapi/helpers"

export const createHuntRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Hunts"],
  summary: "Create a hunt",
  description:
    "Create a new hunt as an organizer. Status defaults to draft.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER])],
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContent(createHuntSchema, "Hunt creation payload"),
  },
  responses: createAuthResponses({
    [StatusCodes.CREATED]: jsonContent(huntSchema, "Hunt created"),
  }),
})

export const listHuntsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Hunts"],
  summary: "List own hunts",
  description:
    "List all hunts owned by the authenticated organizer with pagination.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER])],
  security: [{ bearerAuth: [] }],
  request: {
    query: listHuntsQuerySchema,
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(
      paginatedHuntsSchema,
      "Paginated list of hunts",
    ),
  }),
})

export const getHuntRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Hunts"],
  summary: "Get a hunt by id",
  description: "Get a hunt by id.\n\nRequired roles: player, organizer",
  middleware: [requireRoles([ROLES.PLAYER, ROLES.ORGANIZER])],
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamSchema,
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(huntSchema, "Hunt found"),
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
  }),
})

export const updateHuntRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Hunts"],
  summary: "Update a hunt",
  description:
    "Update a hunt. Only the owner can update.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner],
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamSchema,
    body: jsonContent(updateHuntSchema, "Hunt update payload"),
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(huntSchema, "Hunt updated"),
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
  }),
})

export const deleteHuntRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Hunts"],
  summary: "Delete a hunt",
  description:
    "Delete a hunt. Only the owner can delete.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner],
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamSchema,
  },
  responses: createAuthResponses({
    [StatusCodes.NO_CONTENT]: { description: "Hunt deleted" },
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
  }),
})

export const deleteHuntPointRoute = createRoute({
  method: "delete",
  path: "/{huntId}/points/{id}",
  tags: ["Hunts"],
  summary: "Delete a hunt point",
  description:
    "Delete a hunt point. Only the owner can delete.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner],
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamSchema,
  },
  responses: createAuthResponses({
    [StatusCodes.NO_CONTENT]: { description: "Hunt point deleted" },
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
  }),
})

export const deleteHuntRewardRoute = createRoute({
  method: "delete",
  path: "/{huntId}/rewards/{id}",
  tags: ["Hunts"],
  summary: "Delete a hunt reward",
  description:
    "Delete a hunt reward. Only the owner can delete.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner],
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamSchema,
  },
  responses: createAuthResponses({
    [StatusCodes.NO_CONTENT]: { description: "Hunt reward deleted" },
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
  }),
})

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

export const joinHuntRoute = createRoute({
  method: "post",
  path: "/{id}/join",
  tags: ["Hunts"],
  summary: "Join a hunt",
  description: "Join a published hunt as a player.\n\nRequired roles: player",
  middleware: [requireRoles([ROLES.PLAYER])],
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamSchema,
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
