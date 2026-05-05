import { z } from "zod"

export const changeEmailSchema = z.object({
  newEmail: z.email("Invalid email"),
})

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>
