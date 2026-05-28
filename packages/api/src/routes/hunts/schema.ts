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

export const quizQuestionSchema = z.object({
  id: z.string(),
  huntPointId: z.string(),
  question: z.string(),
  answers: z.array(z.string()),
  correctAnswerIndex: z.number(),
})

export const playerQuizQuestionSchema = quizQuestionSchema.omit({
  correctAnswerIndex: true,
})

export const huntsPointSchema = z.object({
  id: z.string(),
  huntId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  gameType: z.enum([HUNT_GAME_TYPE.QUIZ, HUNT_GAME_TYPE.AR]),
  arId: z.enum(AR_GAME_IDS).nullable().optional(),
  createdAt: z.date(),
  position: z.number(),
  quizQuestion: quizQuestionSchema.optional(),
})

export const playerHuntsPointSchema = huntsPointSchema.extend({
  quizQuestion: playerQuizQuestionSchema.optional(),
})

export const createHuntPointSchema = z.discriminatedUnion("gameType", [
  basePointInputSchema.extend({
    gameType: z.literal(HUNT_GAME_TYPE.QUIZ),
    quiz: quizConfigSchema,
  }),
  basePointInputSchema.extend({
    gameType: z.literal(HUNT_GAME_TYPE.AR),
    arId: z.enum(AR_GAME_IDS, { error: "Please select an AR game" }),
  }),
])

export type CreateHuntPointInput = z.infer<typeof createHuntPointSchema>

export const huntsRewardSchema = z.object({
  id: z.string(),
  huntId: z.string(),
  topX: z.number(),
  promoCode: z.string(),
})

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
  points: z.array(huntsPointSchema),
  reward: huntsRewardSchema,
})

export const playerHuntSchema = huntSchema.extend({
  points: z.array(playerHuntsPointSchema),
})

export const playerHuntDetailSchema = playerHuntSchema.extend({
  completedPointIds: z.array(z.string()),
  totalScore: z.number(),
})

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
  title: z.string().min(HUNT_TITLE_MIN).max(HUNT_TITLE_MAX).optional(),
  description: z.string().min(1).optional(),
  points: z
    .array(createHuntPointSchema)
    .min(HUNT_POINTS_MIN)
    .max(HUNT_POINTS_MAX)
    .optional(),
  reward: huntsRewardSchema.optional(),
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

export const organizerHuntSchema = huntSchema.extend({
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

export const publishedHuntSchema = playerHuntSchema.extend({
  isJoined: z.boolean(),
})

export const paginatedPublishedHuntsSchema =
  createPaginatedResponseSchema(publishedHuntSchema)

export const paginatedMyHuntsSchema =
  createPaginatedResponseSchema(playerHuntSchema)

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
