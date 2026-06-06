import env from "@lootopia/auth/env"
import { ac, roles } from "@lootopia/auth/permissions"
import { dialect } from "@lootopia/db"
import { betterAuth } from "better-auth"
import { admin, openAPI } from "better-auth/plugins"

const cookieAttributes = () => {
  if (process.env.NODE_ENV === "production") {
    return { sameSite: "none" as const, secure: true, partitioned: true }
  }

  return { sameSite: "lax" as const, secure: false }
}

export const auth = betterAuth({
  baseURL: `https://${env.MOBILE_DOMAIN}`,

  database: {
    dialect,
    type: "postgres",
  },
  basePath: "/auth",
  advanced: {
    defaultCookieAttributes: cookieAttributes(),
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
