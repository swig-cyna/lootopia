import type { AuthenticatedContext } from "@lootopia/api/lib/hono"
import { type Hunt, $hunt } from "@lootopia/db/repositories/hunt.repository"
import type { MiddlewareHandler } from "hono"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

export type HuntOwnerContext = AuthenticatedContext & {
  Variables: { hunt: Hunt }
}

export const requireHuntOwner: MiddlewareHandler<HuntOwnerContext> = async (
  { req, json, set, var: { user } },
  next,
) => {
  const id = req.param("huntId")!
  const hunt = await $hunt.byId(id)

  if (!hunt) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  if (hunt.organizerId !== user.id) {
    return json({ error: StatusPhrases.FORBIDDEN }, StatusCodes.FORBIDDEN)
  }

  set("hunt", hunt)

  return next()
}
