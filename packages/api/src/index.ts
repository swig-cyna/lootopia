import env from "@/env.ts"
import { auth } from "@/lib/auth.ts"
import router from "@/routes/route.ts"
import { serve } from "@hono/node-server"
import { OpenAPIHono } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { notFound, onError } from "stoker/middlewares"

const app = new OpenAPIHono()

app.use(
  cors({
    origin: env.WEB_ORIGINS.split(","),
    credentials: true,
  })
)

app.use(logger())

app.onError(onError)
app.notFound(notFound)

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
  })
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
  }
)
