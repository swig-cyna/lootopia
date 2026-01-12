export const ROLES = {
  USER: "user",
  PARTNER: "partner",
  ADMIN: "admin",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
