import { z } from "zod"

export const signinSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export type SigninFormValues = z.infer<typeof signinSchema>
