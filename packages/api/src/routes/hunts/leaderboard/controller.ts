import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { $$hunt } from "@lootopia/api/services/hunt.service"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

import type { getLeaderboardRoute } from "@lootopia/api/routes/hunts/leaderboard/doc"

export const getLeaderboardController: RouteHandler<
  typeof getLeaderboardRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { huntId } = req.valid("param")
  const query = req.valid("query")

  const result = await $$hunt.leaderboard(user.id, huntId, query)

  if (result === "not_found") {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  return json(result, StatusCodes.OK)
}
