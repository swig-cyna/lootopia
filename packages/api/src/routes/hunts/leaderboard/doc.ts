import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import {
  leaderboardQuerySchema,
  paginatedLeaderboardSchema,
} from "@lootopia/api/routes/hunts/leaderboard/schema"
import { huntIdParamSchema } from "@lootopia/api/routes/hunts/schema"
import {
  createAuthResponses,
  errorResponseSchema,
} from "@lootopia/api/utils/responses"
import { ROLES } from "@lootopia/auth/constants"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"
import { jsonContent } from "stoker/openapi/helpers"

export const getLeaderboardRoute = createRoute({
  method: "get",
  path: "/{huntId}/leaderboard",
  tags: ["Hunts"],
  summary: "Get hunt leaderboard",
  description:
    "Get the leaderboard for a published hunt, ranked by total score.\n\nRequired roles: player, organizer",
  middleware: [requireRoles([ROLES.PLAYER, ROLES.ORGANIZER])] as const,
  security: [{ bearerAuth: [] }],
  request: {
    params: huntIdParamSchema,
    query: leaderboardQuerySchema,
  },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(
      paginatedLeaderboardSchema,
      "Paginated leaderboard",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      StatusPhrases.NOT_FOUND,
    ),
  }),
})
