import { dialect } from "@lootopia/api/db"
import env from "@lootopia/api/env"
import { betterAuth } from "better-auth"
import { admin, openAPI } from "better-auth/plugins"
import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"

const statement = {
  ...defaultStatements,
} as const

export const ac = createAccessControl(statement)

const permissions = {
  user: ac.newRole({
    user: [],
  }),
  partner: ac.newRole({
    user: [],
  }),
  admin: ac.newRole({
    ...adminAc.statements,
  }),
}

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
    admin({
      defaultRole: "user",
      ac,
      roles: {
        user: permissions.user,
        partner: permissions.partner,
        admin: permissions.admin,
      },
      adminRoles: ["admin"],
    }),
    openAPI({
      path: "/reference",
    }),
  ],
})
