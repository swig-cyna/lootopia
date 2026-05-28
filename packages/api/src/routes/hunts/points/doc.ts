import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import { requireHuntOwner } from "@lootopia/api/routes/hunts/middlewares"
import {
  validatePointResponseSchema,
  validatePointSchema,
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

export const validatePointRoute = createRoute({
  method: "post",
  path: "/points/{id}/validate",
  tags: ["Hunts"],
  summary: "Validate a hunt point",
  description:
    "Validate a game answer and save player progress.\n\nRequired roles: player, organizer",
  middleware: [requireRoles([ROLES.PLAYER, ROLES.ORGANIZER])],
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamSchema,
    body: jsonContent(validatePointSchema, "Game answer payload"),
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(
      validatePointResponseSchema,
      "Validation result",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
    [StatusCodes.CONFLICT]: jsonContent(
      errorResponseSchema,
      StatusPhrases.CONFLICT,
    ),
    [StatusCodes.FORBIDDEN]: jsonContent(
      errorResponseSchema,
      StatusPhrases.FORBIDDEN,
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
