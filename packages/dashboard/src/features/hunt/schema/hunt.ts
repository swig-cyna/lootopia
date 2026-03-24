import { z } from "zod"

export const huntSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters"),
  points: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      gameType: z.string(),
      position: z.number().positive(),
    })
    .array()
    .min(1, "At least one point is required"),
})

export type HuntFormValues = z.infer<typeof huntSchema>
