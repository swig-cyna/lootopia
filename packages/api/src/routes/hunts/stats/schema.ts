import { z } from "@hono/zod-openapi"
import { HUNT_STATUS } from "@lootopia/common/constants/hunt"

const registrationPointSchema = z.object({
  day: z.string(),
  count: z.number(),
})

const pointFunnelEntrySchema = z.object({
  pointId: z.string(),
  position: z.number(),
  completions: z.number(),
})

export const huntStatsSchema = z.object({
  huntId: z.string(),
  title: z.string(),
  status: z.enum([HUNT_STATUS.DRAFT, HUNT_STATUS.PUBLISHED]),
  participants: z.number(),
  finishers: z.number(),
  completionRate: z.number(),
  averageScore: z.number(),
  rewardsClaimed: z.number(),
  rewardTopX: z.number().nullable(),
  pointFunnel: z.array(pointFunnelEntrySchema),
  registrations: z.array(registrationPointSchema),
})

const topHuntStatsSchema = z.object({
  huntId: z.string(),
  title: z.string(),
  participants: z.number(),
  finishers: z.number(),
  completionRate: z.number(),
})

export const organizerStatsSchema = z.object({
  totalHunts: z.number(),
  publishedHunts: z.number(),
  draftHunts: z.number(),
  totalParticipants: z.number(),
  totalFinishers: z.number(),
  completionRate: z.number(),
  totalRewardsClaimed: z.number(),
  registrations: z.array(registrationPointSchema),
  topHunts: z.array(topHuntStatsSchema),
})
