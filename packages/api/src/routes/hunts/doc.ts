import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import { requireHuntOwner } from "@lootopia/api/routes/hunts/middlewares"
import {
  createHuntSchema,
  huntIdParamSchema,
  huntSchema,
  listOwnHuntsQuerySchema,
  organizerHuntsResponseSchema,
  updateHuntSchema,
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
    query: listOwnHuntsQuerySchema,
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(
      organizerHuntsResponseSchema,
      "Paginated list of hunts",
    ),
  }),
})

export const getHuntRoute = createRoute({
  method: "get",
  path: "/{huntId}",
  tags: ["Hunts"],
  summary: "Get a hunt by id",
  description: "Get a hunt by id.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner],
  security: [{ bearerAuth: [] }],
  request: {
    params: huntIdParamSchema,
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
  path: "/{huntId}",
  tags: ["Hunts"],
  summary: "Update a hunt",
  description:
    "Update a hunt. Only the owner can update.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner],
  security: [{ bearerAuth: [] }],
  request: {
    params: huntIdParamSchema,
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
  path: "/{huntId}",
  tags: ["Hunts"],
  summary: "Delete a hunt",
  description:
    "Delete a hunt. Only the owner can delete.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner],
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

export const updateHuntStatusRoute = createRoute({
  method: "patch",
  path: "/{huntId}/status",
  tags: ["Hunts"],
  summary: "Update hunt status",
  description:
    "Update the status of a hunt to publish or unpublish it.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner],
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
