import { z } from "@hono/zod-openapi"
import {
  createPaginatedResponseSchema,
  paginationMetadataSchema,
  paginationParamsSchema,
} from "@lootopia/api/utils/responses"
import {
  AR_GAME_IDS,
  HUNT_GAME_TYPE,
  HUNT_POINTS_MAX,
  HUNT_POINTS_MIN,
  HUNT_SORT,
  HUNT_STATUS,
  HUNT_TITLE_MAX,
  HUNT_TITLE_MIN,
} from "@lootopia/common/constants/hunt"
import {
  basePointInputSchema,
  quizConfigSchema,
} from "@lootopia/common/schemas/hunt"

// --- Response schemas ---

export const huntPointSummarySchema = z.object({
  id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  position: z.number(),
})

const quizGameDetailSchema = z.object({
  type: z.literal(HUNT_GAME_TYPE.QUIZ),
  quiz: z.object({
    question: z.string(),
    answers: z.array(z.string()),
    correctIndex: z.number(),
  }),
})

const quizGamePlayerSchema = z.object({
  type: z.literal(HUNT_GAME_TYPE.QUIZ),
  quiz: z.object({
    question: z.string(),
    answers: z.array(z.string()),
  }),
})

const arGameSchema = z.object({
  type: z.literal(HUNT_GAME_TYPE.AR),
  arId: z.enum(AR_GAME_IDS),
})

export const huntPointDetailSchema = huntPointSummarySchema.extend({
  game: z.discriminatedUnion("type", [quizGameDetailSchema, arGameSchema]),
})

export const huntPointDetailPlayerSchema = huntPointSummarySchema.extend({
  game: z.discriminatedUnion("type", [quizGamePlayerSchema, arGameSchema]),
})

// --- Input schemas ---

const quizGameInputSchema = z.object({
  type: z.literal(HUNT_GAME_TYPE.QUIZ),
  quiz: quizConfigSchema,
})

const arGameInputSchema = z.object({
  type: z.literal(HUNT_GAME_TYPE.AR),
  arId: z.enum(AR_GAME_IDS, { error: "Please select an AR game" }),
})

export const createHuntPointSchema = basePointInputSchema.extend({
  game: z.discriminatedUnion("type", [quizGameInputSchema, arGameInputSchema]),
})

export type CreateHuntPointInput = z.infer<typeof createHuntPointSchema>

export const updateHuntPointSchema = basePointInputSchema.extend({
  id: z.string().optional(),
  game: z.discriminatedUnion("type", [quizGameInputSchema, arGameInputSchema]),
})

export type UpdateHuntPointInput = z.infer<typeof updateHuntPointSchema>

export const huntsRewardSchema = z.object({
  id: z.string(),
  huntId: z.string(),
  topX: z.number(),
  promoCode: z.string(),
})

export type HuntsRewardInput = z.infer<typeof huntsRewardSchema>

export const createHuntRewardSchema = z.object({
  topX: z.number(),
  promoCode: z.string(),
})

export const huntSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum([HUNT_STATUS.DRAFT, HUNT_STATUS.PUBLISHED]),
  organizerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  points: z.array(huntPointDetailSchema),
  reward: huntsRewardSchema.nullable(),
})

export const playerHuntSchema = huntSchema.omit({ reward: true }).extend({
  points: z.array(huntPointDetailPlayerSchema),
})

export const playerRewardSchema = z
  .object({
    topX: z.number(),
    claimed: z.boolean(),
    eligible: z.boolean(),
    promoCode: z.string().optional(),
  })
  .nullable()

export const playerHuntDetailSchema = playerHuntSchema.extend({
  completedPointIds: z.array(z.string()),
  totalScore: z.number(),
  isJoined: z.boolean(),
  reward: playerRewardSchema,
})

export const claimRewardResponseSchema = z.object({
  promoCode: z.string(),
})

export const finisherRankingSchema = z.object({
  participationId: z.string(),
  score: z.number().nullable(),
  finishedAt: z.date().nullable(),
})

export const rewardStateSchema = huntsRewardSchema.omit({ huntId: true })

export const createHuntSchema = z.object({
  title: z.string().min(HUNT_TITLE_MIN).max(HUNT_TITLE_MAX),
  description: z.string().optional(),
  points: z
    .array(createHuntPointSchema)
    .min(HUNT_POINTS_MIN, `You must place at least ${HUNT_POINTS_MIN} points`)
    .max(HUNT_POINTS_MAX, `You can place at most ${HUNT_POINTS_MAX} points`),
  reward: createHuntRewardSchema,
})

export const updateHuntSchema = z.object({
  title: z.string().min(HUNT_TITLE_MIN).max(HUNT_TITLE_MAX),
  description: z.string(),
  points: z
    .array(updateHuntPointSchema)
    .min(HUNT_POINTS_MIN)
    .max(HUNT_POINTS_MAX),
  reward: huntsRewardSchema,
})

export const validatePointSchema = z.discriminatedUnion("gameType", [
  z.object({
    gameType: z.literal(HUNT_GAME_TYPE.QUIZ),
    selectedAnswerIndex: z.number().min(0),
    score: z.number().int().nonnegative(),
  }),
  z.object({
    gameType: z.literal(HUNT_GAME_TYPE.AR),
    score: z.number().int().nonnegative(),
  }),
])

export const updateHuntStatusSchema = z.object({
  status: z.enum([HUNT_STATUS.DRAFT, HUNT_STATUS.PUBLISHED]),
})

export const validatePointResponseSchema = z.object({
  isCorrect: z.boolean(),
})

export const listHuntsQuerySchema = paginationParamsSchema

export const listOwnHuntsQuerySchema = paginationParamsSchema.extend({
  status: z.enum([HUNT_STATUS.DRAFT, HUNT_STATUS.PUBLISHED]).optional(),
  search: z.string().optional(),
  sort: z
    .enum([HUNT_SORT.RECENT, HUNT_SORT.OLDEST, HUNT_SORT.TITLE])
    .optional()
    .default(HUNT_SORT.RECENT),
})

export const organizerHuntSchema = huntSchema.omit({ points: true }).extend({
  points: z.array(huntPointSummarySchema),
  playerCount: z.number(),
  completionRate: z.number(),
})

export const organizerHuntsResponseSchema = z.object({
  data: z.array(organizerHuntSchema),
  metadata: paginationMetadataSchema,
  counts: z.object({
    all: z.number(),
    published: z.number(),
    draft: z.number(),
  }),
})

export const huntParticipationSchema = z.object({
  id: z.string(),
  huntId: z.string(),
  userId: z.string(),
  joinedAt: z.date(),
})

const huntListBaseSchema = huntSchema
  .omit({ points: true, reward: true })
  .extend({
    points: z.array(huntPointSummarySchema),
  })

export const publishedHuntSchema = huntListBaseSchema.extend({
  isJoined: z.boolean(),
})

export const paginatedPublishedHuntsSchema =
  createPaginatedResponseSchema(publishedHuntSchema)

export const paginatedMyHuntsSchema =
  createPaginatedResponseSchema(huntListBaseSchema)

export const huntIdParamSchema = z.object({
  huntId: z.string(),
})

export const huntPointParamSchema = z.object({
  huntId: z.string(),
  pointId: z.string(),
})

export const huntRewardParamSchema = z.object({
  huntId: z.string(),
  rewardId: z.string(),
})
