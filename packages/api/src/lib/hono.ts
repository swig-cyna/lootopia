import { OpenAPIHono, type Hook } from "@hono/zod-openapi"
import { auth } from "@lootopia/auth/server"
import type { Env, Schema } from "hono"
import * as StatusCodes from "stoker/http-status-codes"

export type HonoContext = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}

export type AuthenticatedContext = HonoContext & {
  Variables: {
    user: typeof auth.$Infer.Session.user
    session: typeof auth.$Infer.Session.session
  }
}

const defaultHook: Hook<any, any, any, any> = (result, { json }) => {
  if (result.success) {
    return result
  }

  return json(
    { error: "Validation error", details: result.error.issues },
    StatusCodes.BAD_REQUEST,
  )
}

export const createRouter = <
  E extends Env = HonoContext,
  S extends Schema = {},
>() => new OpenAPIHono<E, S>({ defaultHook })
