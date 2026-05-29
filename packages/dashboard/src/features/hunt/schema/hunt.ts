import {
  AR_GAME_IDS,
  HUNT_GAME_TYPE,
  HUNT_POINTS_MIN,
  HUNT_TITLE_MAX,
  HUNT_TITLE_MIN,
} from "@lootopia/common/constants/hunt"
import {
  basePointInputSchema,
  quizConfigSchema,
  rewardConfigSchema,
} from "@lootopia/common/schemas/hunt"
import { z } from "zod"

const basePointSchema = basePointInputSchema.extend({ id: z.string() })

const quizGameSchema = z.object({
  type: z.literal(HUNT_GAME_TYPE.QUIZ),
  quiz: quizConfigSchema,
})

const arGameSchema = z.object({
  type: z.literal(HUNT_GAME_TYPE.AR),
  arId: z.enum(AR_GAME_IDS),
})

const noneGameSchema = z.object({
  type: z.literal(HUNT_GAME_TYPE.NONE),
})

const pointGameSchema = z.discriminatedUnion("type", [
  quizGameSchema,
  arGameSchema,
  noneGameSchema,
])

export const huntSchema = z.object({
  title: z
    .string()
    .min(HUNT_TITLE_MIN, "Title must be at least 2 characters")
    .max(HUNT_TITLE_MAX, "Title must be at most 255 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters"),
  points: z
    .array(basePointSchema.extend({ game: pointGameSchema }))
    .min(HUNT_POINTS_MIN, "You must place at least 3 points")
    .refine(
      (points) => points.every((point, index) => point.position === index + 1),
      "All points must have a unique position",
    )
    .superRefine((points, ctx) => {
      const hasUnconfigured = points.some(
        (point) => point.game.type === HUNT_GAME_TYPE.NONE,
      )

      if (hasUnconfigured) {
        ctx.addIssue({
          code: "custom",
          message: "Some points still need to be configured",
        })
      }

      points.forEach((point, index) => {
        if (point.game.type === HUNT_GAME_TYPE.NONE) {
          ctx.addIssue({
            code: "custom",
            message: "All points must have a game type",
            path: [index, "game", "type"],
          })
        }
      })
    }),
  reward: rewardConfigSchema,
})

export type HuntFormValues = z.infer<typeof huntSchema>

type HuntFormPoint = HuntFormValues["points"][number]
type HuntFormPointGame = HuntFormPoint["game"]

export type HuntPointDraft = Omit<HuntFormPoint, "game"> & {
  game: Extract<HuntFormPointGame, { type: "none" }>
}

export type HuntSubmitData = Omit<HuntFormValues, "points"> & {
  points: Array<
    Omit<HuntFormPoint, "id" | "game"> & {
      game: Exclude<HuntFormPointGame, { type: "none" }>
    }
  >
}
