import { createEnv } from "@t3-oss/env-core"
import { z } from "zod/v4"

const env = createEnv({
  server: {
    API_PORT: z.coerce.number().default(3001),
    POSTGRES_USER: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_PORT: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    WEB_ORIGINS: z.string(),
  },

  runtimeEnv: {
    API_PORT: process.env.PORT,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    WEB_ORIGINS: process.env.WEB_ORIGINS,
  },
})

export default env
