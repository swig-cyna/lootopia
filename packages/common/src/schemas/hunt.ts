import { AR_GAME_IDS, QUIZ_ANSWERS_MIN } from "@lootopia/common/constants/hunt"
import { z } from "zod"

export const basePointInputSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  position: z.number().int().positive(),
})

export const quizConfigSchema = z
  .object({
    question: z.string().min(1, "Question is required"),
    answers: z
      .array(z.string().min(1, "Answer text is required"))
      .min(QUIZ_ANSWERS_MIN, `At least ${QUIZ_ANSWERS_MIN} answers required`),
    correctAnswerIndex: z
      .number({ error: "Please select a correct answer" })
      .int()
      .min(0, "Please select a correct answer"),
  })
  .refine((data) => data.correctAnswerIndex < data.answers.length, {
    message: "Correct answer index must be a valid index in the answers array",
    path: ["correctAnswerIndex"],
  })

export const arConfigSchema = z.object({
  arId: z.enum(AR_GAME_IDS, { error: "Please select an AR game" }),
})

export const rewardConfigSchema = z.object({
  topX: z
    .number({ error: "Number of winners is required" })
    .int()
    .min(1, "At least 1 winner is required"),
  promoCode: z.string().min(1, "Promo code is required"),
})

export type QuizConfigValues = z.infer<typeof quizConfigSchema>
export type ArConfigValues = z.infer<typeof arConfigSchema>
export type RewardConfigValues = z.infer<typeof rewardConfigSchema>
