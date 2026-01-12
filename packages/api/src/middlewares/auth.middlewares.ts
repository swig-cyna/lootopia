import { auth } from "@lootopia/api/lib/auth"
import { Role, ROLES } from "@lootopia/api/utils/constants"
import { MiddlewareHandler } from "hono"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  c.set("user", session ? session.user : null)
  c.set("session", session ? session.session : null)

  return await next()
}

export const loggedInMiddleware: MiddlewareHandler = async (c, next) => {
  if (!c.var.user) {
    return c.json(
      { error: StatusPhrases.UNAUTHORIZED },
      StatusCodes.UNAUTHORIZED
    )
  }

  return await next()
}

export const requireRoles = (allowedRoles: Role[]): MiddlewareHandler => async (c, next) => {
    if (!c.var.user) {
      return c.json(
        { error: StatusPhrases.UNAUTHORIZED },
        StatusCodes.UNAUTHORIZED
      )
    }

    const userRole = c.var.user.role

    if (userRole === ROLES.ADMIN) {
      return await next()
    }

    if (!allowedRoles.includes(userRole)) {
      return c.json({ error: StatusPhrases.FORBIDDEN }, StatusCodes.FORBIDDEN)
    }

    return await next()
  }
