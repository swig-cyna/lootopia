import { z } from "@hono/zod-openapi"
import {
  createPaginatedResponseSchema,
  paginationParamsSchema,
} from "@lootopia/api/utils/responses"

export const leaderboardEntrySchema = z.object({
  rank: z.number(),
  userId: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  totalScore: z.number(),
  completedPoints: z.number(),
})

export const leaderboardQuerySchema = paginationParamsSchema.extend({
  search: z.string().optional(),
})

export const myRankSchema = z
  .object({
    rank: z.number(),
    totalScore: z.number(),
    completedPoints: z.number(),
  })
  .nullable()

export const paginatedLeaderboardSchema = createPaginatedResponseSchema(
  leaderboardEntrySchema,
).extend({
  myRank: myRankSchema,
})
