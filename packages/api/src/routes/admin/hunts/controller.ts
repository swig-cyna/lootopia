import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import type {
  adminDeleteHuntRoute,
  adminUpdateHuntStatusRoute,
  listAllHuntsRoute,
} from "@lootopia/api/routes/admin/hunts/doc"
import { $$hunt } from "@lootopia/api/services/hunt.service"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

export const listAllHuntsController: RouteHandler<
  typeof listAllHuntsRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const result = await $$hunt.listAll(req.valid("query"))

  return json(result, StatusCodes.OK)
}

export const adminUpdateHuntStatusController: RouteHandler<
  typeof adminUpdateHuntStatusRoute,
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

export const adminDeleteHuntController: RouteHandler<
  typeof adminDeleteHuntRoute,
  AuthenticatedContext
> = async ({ req, body }) => {
  await $$hunt.delete(req.valid("param").huntId)

  return body(null, StatusCodes.NO_CONTENT)
}
