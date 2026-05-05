import { createEnv } from "@t3-oss/env-core"
import { z } from "zod/v4"

const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string(),
    WEB_BASE_URL: z.string(),
  },

  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    WEB_BASE_URL: process.env.WEB_BASE_URL,
  },
})

export default env
