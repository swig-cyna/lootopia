import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { $$hunt } from "@lootopia/api/services/hunt.service"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

import type {
  createHuntRoute,
  deleteHuntRoute,
  getHuntRoute,
  listHuntsRoute,
  updateHuntRoute,
  updateHuntStatusRoute,
} from "@lootopia/api/routes/hunts/doc"

export const createHuntController: RouteHandler<
  typeof createHuntRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const hunt = await $$hunt.create(user.id, req.valid("json"))

  return json(hunt, StatusCodes.CREATED)
}

export const listHuntsController: RouteHandler<
  typeof listHuntsRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const result = await $$hunt.list(user.id, req.valid("query"))

  return json(result, StatusCodes.OK)
}

export const getHuntController: RouteHandler<
  typeof getHuntRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const hunt = await $$hunt.getById(req.valid("param").huntId)

  if (!hunt) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  return json(hunt, StatusCodes.OK)
}

export const updateHuntController: RouteHandler<
  typeof updateHuntRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const hunt = await $$hunt.update(req.valid("param").huntId, req.valid("json"))

  if (!hunt) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  return json(hunt, StatusCodes.OK)
}

export const deleteHuntController: RouteHandler<
  typeof deleteHuntRoute,
  AuthenticatedContext
> = async ({ req, body }) => {
  await $$hunt.delete(req.valid("param").huntId)

  return body(null, StatusCodes.NO_CONTENT)
}

export const updateHuntStatusController: RouteHandler<
  typeof updateHuntStatusRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const hunt = await $$hunt.updateStatus(
    req.valid("param").huntId,
    req.valid("json"),
  )

  if (!hunt) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  return json(hunt, StatusCodes.OK)
}
