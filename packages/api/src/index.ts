import { serve } from "@hono/node-server"
import { OpenAPIHono } from "@hono/zod-openapi"
import env from "@lootopia/api/env"
import { HonoContext } from "@lootopia/api/lib/hono"
import { authMiddleware } from "@lootopia/api/middlewares/auth.middlewares"
import router from "@lootopia/api/routes/route"
import { auth } from "@lootopia/auth/server"
import { Scalar } from "@scalar/hono-api-reference"
import { cors } from "hono/cors"
import { HTTPException } from "hono/http-exception"
import { logger } from "hono/logger"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

const app = new OpenAPIHono<HonoContext>({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: "Validation error",
          details: result.error.issues,
        },
        StatusCodes.BAD_REQUEST,
      )
    }

    return result
  },
})

app.use(
  cors({
    origin: env.WEB_ORIGINS.split(","),
    credentials: true,
  }),
)
app.use(authMiddleware)
app.use(logger())

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status)
  }

  console.error(err)

  return c.json(
    { error: StatusPhrases.INTERNAL_SERVER_ERROR },
    StatusCodes.INTERNAL_SERVER_ERROR,
  )
})

app.notFound((c) =>
  c.json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND),
)

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "API",
  },
})

app.get(
  "/reference",
  Scalar({
    url: "/doc",
  }),
)

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))

app.route("/", router)

serve(
  {
    fetch: app.fetch,
    port: env.API_PORT,
  },
  (info) => {
    console.log(`API is running on http://localhost:${info.port}`)
  },
)
