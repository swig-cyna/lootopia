import { createEnv } from "@t3-oss/env-core"
import { z } from "zod/v4"

const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string(),
    WEB_ORIGINS: z.string(),
  },

  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    WEB_ORIGINS: process.env.WEB_ORIGINS,
  },
})

export default env
