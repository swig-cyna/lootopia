import { createEnv } from "@t3-oss/env-core"
import { z } from "zod/v4"

const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string(),
    MOBILE_DOMAIN: z.string(),
  },

  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    MOBILE_DOMAIN: process.env.MOBILE_DOMAIN,
  },
})

export default env
