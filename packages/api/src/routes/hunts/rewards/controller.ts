import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { $huntReward } from "@lootopia/db/repositories/hunt-reward.repository"
import * as StatusCodes from "stoker/http-status-codes"

import type { deleteHuntRewardRoute } from "@lootopia/api/routes/hunts/rewards/doc"

export const deleteHuntRewardController: RouteHandler<
  typeof deleteHuntRewardRoute,
  AuthenticatedContext
> = async ({ req, body }) => {
  const { rewardId } = req.valid("param")

  await $huntReward.delete(rewardId)

  return body(null, StatusCodes.NO_CONTENT)
}
