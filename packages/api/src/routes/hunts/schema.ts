import { z } from "@hono/zod-openapi"
import {
  createPaginatedResponseSchema,
  paginationParamsSchema,
} from "@lootopia/api/utils/responses"
import { HUNT_GAME_TYPE, HUNT_STATUS } from "@lootopia/db/models/hunt"

export const quizQuestionSchema = z.object({
  id: z.string(),
  huntPointId: z.string(),
  question: z.string(),
  answers: z.array(z.string()),
  correctAnswerIndex: z.number(),
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
    quizz: quizConfigInputSchema,
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
  huntId: z.string(),
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
})

export const createHuntSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  points: z
    .array(createHuntPointSchema)
    .min(3, "You must place at least 3 points")
    .max(5, "You can place at most 5 points"),
})

export const updateHuntSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  status: z.enum([HUNT_STATUS.DRAFT, HUNT_STATUS.PUBLISHED]).optional(),
  points: z.array(createHuntPointSchema).min(3).max(5).optional(),
})

export const listHuntsQuerySchema = paginationParamsSchema

export const paginatedHuntsSchema = createPaginatedResponseSchema(huntSchema)

export const huntParticipationSchema = z.object({
  id: z.string(),
  huntId: z.string(),
  userId: z.string(),
  joinedAt: z.date(),
})

export const publishedHuntSchema = huntSchema.extend({
  isJoined: z.boolean(),
})

export const paginatedPublishedHuntsSchema =
  createPaginatedResponseSchema(publishedHuntSchema)

export const paginatedMyHuntsSchema = createPaginatedResponseSchema(huntSchema)
