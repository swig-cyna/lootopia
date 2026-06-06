import { z } from "@hono/zod-openapi"
import {
  listOwnHuntsQuerySchema,
  organizerHuntSchema,
} from "@lootopia/api/routes/hunts/schema"
import { paginationMetadataSchema } from "@lootopia/api/utils/responses"

export const listAllHuntsQuerySchema = listOwnHuntsQuerySchema

export const adminHuntOrganizerSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  })
  .nullable()

export const adminHuntSchema = organizerHuntSchema.extend({
  organizer: adminHuntOrganizerSchema,
})

export const adminHuntsResponseSchema = z.object({
  data: z.array(adminHuntSchema),
  metadata: paginationMetadataSchema,
  counts: z.object({
    all: z.number(),
    published: z.number(),
    draft: z.number(),
  }),
})
