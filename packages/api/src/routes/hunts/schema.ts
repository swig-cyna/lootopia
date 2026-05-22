import { z } from "@hono/zod-openapi"
import {
  createPaginatedResponseSchema,
  paginationMetadataSchema,
  paginationParamsSchema,
} from "@lootopia/api/utils/responses"
import {
  HUNT_GAME_TYPE,
  HUNT_SORT,
  HUNT_STATUS,
} from "@lootopia/db/models/hunt"

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
  arId: z.string().nullable().optional(),
  createdAt: z.date(),
  position: z.number(),
  quizQuestion: quizQuestionSchema.optional(),
})

export const playerHuntsPointSchema = huntsPointSchema.extend({
  quizQuestion: playerQuizQuestionSchema.optional(),
})

const quizConfigInputSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answers: z
    .array(z.string().min(1, "Answer text is required"))
    .min(2, "At least 2 answers required"),
  correctAnswerIndex: z.number().min(0),
})

const basePointInputSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  position: z.number().positive(),
})

export const createHuntPointSchema = z.discriminatedUnion("gameType", [
  basePointInputSchema.extend({
    gameType: z.literal(HUNT_GAME_TYPE.QUIZ),
    quiz: quizConfigInputSchema,
  }),
  basePointInputSchema.extend({
    gameType: z.literal(HUNT_GAME_TYPE.AR),
    arId: z.string().min(1, "Please select an AR game"),
  }),
])

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
})

export const createHuntSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  points: z
    .array(createHuntPointSchema)
    .min(3, "You must place at least 3 points")
    .max(5, "You can place at most 5 points"),
  reward: createHuntRewardSchema,
})

export const updateHuntSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  status: z.enum([HUNT_STATUS.DRAFT, HUNT_STATUS.PUBLISHED]).optional(),
  points: z.array(createHuntPointSchema).min(3).max(5).optional(),
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
