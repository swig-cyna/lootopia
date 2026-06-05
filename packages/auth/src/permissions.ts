import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"

const statement = {
  ...defaultStatements,
} as const

export const ac = createAccessControl(statement)

export const roles = {
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
