import { dialect } from "@/db/index.ts"
import env from "@/env.ts"
import { betterAuth } from "better-auth"
import { openAPI } from "better-auth/plugins"

export const auth = betterAuth({
  trustedOrigins: env.WEB_ORIGINS.split(","),
  database: {
    dialect,
    type: "postgres",
  },
  basePath: "/auth",
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 25,
  },
  plugins: [
    openAPI({
      path: "/reference",
    }),
  ],
})
