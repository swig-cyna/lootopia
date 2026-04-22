import { HUNT_GAME_TYPE } from "@lootopia/dashboard/features/hunt/utils/constant.ts"
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
      gameType: z.enum([HUNT_GAME_TYPE.QUIZ, HUNT_GAME_TYPE.AR]),
      position: z.number().positive(),
      quizQuestion: z
        .object({
          question: z.string().min(1, "Question is required"),
          answers: z
            .array(z.string().min(1, "Answer cannot be empty"))
            .min(2, "There must be at least 2 answers"),
          correctAnswerIndex: z.number().min(0),
        })
        .optional(),
    })
    .array()
    .min(3, "You must place at least 3 points")
    .max(5, "You can place at most 5 points"),
})

export type HuntFormValues = z.infer<typeof huntSchema>
