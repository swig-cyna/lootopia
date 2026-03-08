import { createEnv } from "@t3-oss/env-core"
import { z } from "zod/v4"

const env = createEnv({
  server: {
    WEB_ORIGINS: z.string(),
  },

  runtimeEnv: {
    WEB_ORIGINS: process.env.WEB_ORIGINS,
  },
})

export default env
