import { z } from "@hono/zod-openapi"
import { HUNT_STATUS } from "@lootopia/db/models/hunt"
import { createPaginatedResponseSchema, paginationParamsSchema } from "@lootopia/api/utils/responses"

export const huntSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum([HUNT_STATUS.DRAFT, HUNT_STATUS.PUBLISHED]),
  organizerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createHuntSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
})

export const updateHuntSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  status: z.enum([HUNT_STATUS.DRAFT, HUNT_STATUS.PUBLISHED]).optional(),
})

export const listHuntsQuerySchema = paginationParamsSchema

export const paginatedHuntsSchema = createPaginatedResponseSchema(huntSchema)
