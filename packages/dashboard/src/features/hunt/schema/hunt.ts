import { HUNT_GAME_TYPE } from "@lootopia/dashboard/features/hunt/utils/constants"
import { z } from "zod"

const basePointSchema = z.object({
  id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  position: z.number().positive(),
})

export const quizConfigSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answers: z
    .array(z.string().min(1, "Answer text is required"))
    .min(2, "At least 2 answers required"),
  correctAnswerIndex: z
    .number({ error: "Please select a correct answer" })
    .min(0, "Please select a correct answer"),
})

export const arConfigSchema = z.object({
  arId: z.string().min(1, "Please select an AR game"),
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

export const huntSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters"),
  points: z
    .array(
      z.discriminatedUnion("gameType", [
        z.object({
          ...basePointSchema.shape,
          gameType: z.literal(HUNT_GAME_TYPE.QUIZ),
          quiz: quizConfigSchema,
        }),
        z.object({
          ...basePointSchema.shape,
          gameType: z.literal(HUNT_GAME_TYPE.AR),
          arId: z.string().min(1, "Please select an AR game"),
        }),
        z.object({
          ...basePointSchema.shape,
          gameType: z.literal(HUNT_GAME_TYPE.NONE),
        }),
      ]),
    )
    .min(3, "You must place at least 3 points")
    .refine(
      (points) => points.every((point, index) => point.position === index + 1),
      "All points must have a unique position",
    )
    .superRefine((points, ctx) => {
      const hasUnconfigured = points.some(
        (point) => point.gameType === HUNT_GAME_TYPE.NONE,
      )

      if (hasUnconfigured) {
        ctx.addIssue({
          code: "custom",
          message: "Some points still need to be configured",
        })
      }

      points.forEach((point, index) => {
        if (point.gameType === HUNT_GAME_TYPE.NONE) {
          ctx.addIssue({
            code: "custom",
            message: "All points must have a game type",
            path: [index, "gameType"],
          })
        }
      })
    }),
  reward: rewardConfigSchema,
})

export type HuntFormValues = z.infer<typeof huntSchema>

export type HuntPointDraft = Extract<
  HuntFormValues["points"][number],
  { gameType: "none" }
>
