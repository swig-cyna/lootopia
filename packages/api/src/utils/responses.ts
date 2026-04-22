import { z } from "@hono/zod-openapi"
import * as StatusCodes from "stoker/http-status-codes"
import { jsonContent } from "stoker/openapi/helpers"

export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.unknown().optional(),
})

export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

export const paginationParamsSchema = z
  .object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform(Number)
      .pipe(z.number().min(1)),
    limit: z
      .string()
      .optional()
      .default("20")
      .transform(Number)
      .pipe(z.number().min(1).max(100)),
  })

export const paginationMetadataSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
})

export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    data: z.array(dataSchema),
    metadata: paginationMetadataSchema,
  })

export const paginate = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) => ({
  data,
  metadata: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
  },
})

export const idParamSchema = z.object({
  id: z.string().openapi({ param: { name: "id", in: "path" } }),
})

export const createAuthResponses = <T extends Record<number, unknown>>(
  responses: T,
) => ({
  ...responses,
  [StatusCodes.UNAUTHORIZED]: jsonContent(errorResponseSchema, "Unauthorized"),
  [StatusCodes.FORBIDDEN]: jsonContent(errorResponseSchema, "Forbidden"),
})
