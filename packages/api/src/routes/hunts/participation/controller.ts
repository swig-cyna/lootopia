import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { $$hunt } from "@lootopia/api/services/hunt.service"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

import type {
  claimRewardRoute,
  getPublishedHuntRoute,
  joinHuntRoute,
  listMyHuntsRoute,
  listPublishedHuntsRoute,
} from "@lootopia/api/routes/hunts/participation/doc"

export const listPublishedHuntsController: RouteHandler<
  typeof listPublishedHuntsRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const result = await $$hunt.listPublished(user.id, req.valid("query"))

  return json(result, StatusCodes.OK)
}

export const listMyHuntsController: RouteHandler<
  typeof listMyHuntsRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const result = await $$hunt.listMyHunts(user.id, req.valid("query"))

  return json(result, StatusCodes.OK)
}

export const getPublishedHuntController: RouteHandler<
  typeof getPublishedHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const hunt = await $$hunt.getPublished(user.id, req.valid("param").huntId)

  if (!hunt) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  return json(hunt, StatusCodes.OK)
}

export const joinHuntController: RouteHandler<
  typeof joinHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const result = await $$hunt.join(user.id, req.valid("param").huntId)

  if (result === "not_found") {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  if (result === "already_joined") {
    return json({ error: "Already joined this hunt" }, StatusCodes.CONFLICT)
  }

  return json(result, StatusCodes.CREATED)
}

export const claimRewardController: RouteHandler<
  typeof claimRewardRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const result = await $$hunt.claimReward(user.id, req.valid("param").huntId)

  if (result === "not_found") {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  if (result === "already_claimed") {
    return json({ error: "Reward already claimed" }, StatusCodes.CONFLICT)
  }

  if (result === "not_finished") {
    return json(
      { error: "Finish the hunt to claim its reward" },
      StatusCodes.UNPROCESSABLE_ENTITY,
    )
  }

  if (result === "not_eligible") {
    return json(
      { error: "You are not within the top players for this reward" },
      StatusCodes.FORBIDDEN,
    )
  }

  return json(result, StatusCodes.CREATED)
}
