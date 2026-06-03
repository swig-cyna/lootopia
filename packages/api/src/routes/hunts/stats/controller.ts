import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { $$huntStats } from "@lootopia/api/services/hunt-stats.service"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

import type {
  getHuntStatsRoute,
  getOrganizerStatsRoute,
} from "@lootopia/api/routes/hunts/stats/doc"

export const getOrganizerStatsController: RouteHandler<
  typeof getOrganizerStatsRoute,
  AuthenticatedContext
> = async ({ json, var: { user } }) => {
  const stats = await $$huntStats.getOrganizerStats(user.id)

  return json(stats, StatusCodes.OK)
}

export const getHuntStatsController: RouteHandler<
  typeof getHuntStatsRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const stats = await $$huntStats.getHuntStats(req.valid("param").huntId)

  if (!stats) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  return json(stats, StatusCodes.OK)
}
