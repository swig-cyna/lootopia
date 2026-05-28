import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import { requireHuntOwner } from "@lootopia/api/routes/hunts/middlewares"
import { huntRewardParamSchema } from "@lootopia/api/routes/hunts/schema"
import {
  createAuthResponses,
  errorResponseSchema,
} from "@lootopia/api/utils/responses"
import { ROLES } from "@lootopia/auth/constants"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"
import { jsonContent } from "stoker/openapi/helpers"

export const deleteHuntRewardRoute = createRoute({
  method: "delete",
  path: "/{huntId}/rewards/{rewardId}",
  tags: ["Hunts"],
  summary: "Delete a hunt reward",
  description:
    "Delete a hunt reward. Only the owner can delete.\n\nRequired roles: organizer",
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner],
  security: [{ bearerAuth: [] }],
  request: {
    params: huntRewardParamSchema,
  },
  responses: createAuthResponses({
    [StatusCodes.NO_CONTENT]: { description: "Hunt reward deleted" },
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
  }),
})
