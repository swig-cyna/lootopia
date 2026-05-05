import env from "@lootopia/auth/env"
import { dialect } from "@lootopia/db"
import { betterAuth } from "better-auth"
import { admin, openAPI } from "better-auth/plugins"
import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"

const statement = {
  ...defaultStatements,
} as const

export const ac = createAccessControl(statement)

const permissions = {
  player: ac.newRole({
    user: [],
  }),
  organizer: ac.newRole({
    user: [],
  }),
  admin: ac.newRole({
    ...adminAc.statements,
  }),
}

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
      roles: {
        player: permissions.player,
        organizer: permissions.organizer,
        admin: permissions.admin,
      },
      adminRoles: ["admin"],
    }),
    openAPI({
      path: "/reference",
    }),
  ],
})
