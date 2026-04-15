import { z } from "@hono/zod-openapi"
import {
  createPaginatedResponseSchema,
  paginationParamsSchema,
} from "@lootopia/api/utils/responses"
import { HUNT_GAME_TYPE, HUNT_STATUS } from "@lootopia/db/models/hunt"

export const huntsPointSchema = z.object({
  id: z.string(),
  huntId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  gameType: z.enum([HUNT_GAME_TYPE.QUIZ, HUNT_GAME_TYPE.AR]),
  createdAt: z.date(),
  position: z.number(),
})

export const createHuntPointSchema = z.object({
  huntId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  gameType: z.enum([HUNT_GAME_TYPE.QUIZ, HUNT_GAME_TYPE.AR]),
  position: z.number(),
})

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
  description: z.string().min(1),
  points: z
    .array(createHuntPointSchema.omit({ huntId: true }))
    .min(3, "You must place at least 3 points")
    .max(5, "You can place at most 5 points"),
})

export const updateHuntSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  status: z.enum([HUNT_STATUS.DRAFT, HUNT_STATUS.PUBLISHED]).optional(),
  points: z.array(huntsPointSchema).optional(),
})

export const listHuntsQuerySchema = paginationParamsSchema

export const paginatedHuntsSchema = createPaginatedResponseSchema(huntSchema)
