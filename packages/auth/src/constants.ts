export const ROLES = {
  PLAYER: "player",
  ORGANIZER: "organizer",
  ADMIN: "admin",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
