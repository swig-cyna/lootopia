import { z } from "@hono/zod-openapi"

export const messageResponseSchema = z.object({
  message: z.string(),
})
