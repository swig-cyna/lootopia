import { ROLES } from "@lootopia/auth/constants"
import { z } from "zod"

const NAME_MIN = 2
const PASSWORD_MIN = 8
const PASSWORD_MAX = 25

export const createUserSchema = z.object({
  name: z.string().min(NAME_MIN, "Name must be at least 2 characters"),
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(PASSWORD_MIN, "Password must be at least 8 characters")
    .max(PASSWORD_MAX, "Password must be at most 25 characters"),
  role: z.enum([ROLES.PLAYER, ROLES.ORGANIZER, ROLES.ADMIN]),
})

export type CreateUserValues = z.infer<typeof createUserSchema>
