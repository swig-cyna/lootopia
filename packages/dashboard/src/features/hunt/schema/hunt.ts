import {
  AR_GAME_IDS,
  HUNT_POINTS_MIN,
  HUNT_TITLE_MAX,
  HUNT_TITLE_MIN,
} from "@lootopia/common/constants/hunt"
import {
  basePointInputSchema,
  quizConfigSchema,
  rewardConfigSchema,
} from "@lootopia/common/schemas/hunt"
import { HUNT_GAME_TYPE } from "@lootopia/dashboard/features/hunt/utils/constants"
import { z } from "zod"

const basePointSchema = basePointInputSchema.extend({ id: z.string() })

export const huntSchema = z.object({
  title: z
    .string()
    .min(HUNT_TITLE_MIN, "Title must be at least 2 characters")
    .max(HUNT_TITLE_MAX, "Title must be at most 255 characters"),
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
          arId: z.enum(AR_GAME_IDS),
        }),
        z.object({
          ...basePointSchema.shape,
          gameType: z.literal(HUNT_GAME_TYPE.NONE),
        }),
      ]),
    )
    .min(HUNT_POINTS_MIN, "You must place at least 3 points")
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

type DistributiveOmit<T, K extends PropertyKey> = T extends T
  ? Omit<T, K>
  : never

export type HuntSubmitData = Omit<HuntFormValues, "points"> & {
  points: Array<
    DistributiveOmit<
      Exclude<HuntFormValues["points"][number], HuntPointDraft>,
      "id"
    >
  >
}
