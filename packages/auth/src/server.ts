import env from "@lootopia/auth/env"
import { ac, roles } from "@lootopia/auth/permissions"
import { dialect } from "@lootopia/db"
import { betterAuth } from "better-auth"
import { admin, openAPI } from "better-auth/plugins"

export const auth = betterAuth({
  baseURL: env.WEB_BASE_URL,

  database: {
    dialect,
    type: "postgres",
  },
  basePath: "/auth",
  advanced: {
    defaultCookieAttributes:
      process.env.NODE_ENV === "production"
        ? { sameSite: "none", secure: true, partitioned: true }
        : { sameSite: "lax", secure: false },
    disableOriginCheck: true,
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 25,
  },
  plugins: [
    admin({
      defaultRole: "player",
      ac,
      roles,
      adminRoles: ["admin"],
    }),
    openAPI({
      path: "/reference",
    }),
  ],
})
