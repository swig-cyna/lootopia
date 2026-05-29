# Creating Routes

Step-by-step guide for the 4 core files every route needs.

For optional patterns: [Services & Mappers](services.md) · [Ownership Middlewares](middlewares.md) · [Pagination](pagination.md)

---

## Route Structure

```
packages/api/src/routes/your-route/
├── schema.ts        # Zod schemas (request + response)
├── doc.ts           # OpenAPI route definitions
├── controller.ts    # HTTP handlers — thin, delegates to the service
├── route.ts         # Assembly: wires doc + controller + sub-routers
├── mappers.ts       # (optional) DB model → API response transformations
├── middlewares.ts   # (optional) route-specific middlewares & context types
└── sub-resource/    # (optional) sub-routes mounted in route.ts
```

---

## 1. `schema.ts`

```typescript
import { z } from "@hono/zod-openapi"
import {
  createPaginatedResponseSchema,
  paginationParamsSchema,
} from "@lootopia/api/utils/responses"

export const createItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
})

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
})

export const listItemsQuerySchema = paginationParamsSchema.extend({
  search: z.string().optional(),
})

export const paginatedItemsSchema = createPaginatedResponseSchema(itemSchema)
```

## 2. `doc.ts`

```typescript
import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import {
  createAuthResponses,
  errorResponseSchema,
  idParamSchema,
} from "@lootopia/api/utils/responses"
import { ROLES } from "@lootopia/auth/constants"
import * as StatusCodes from "stoker/http-status-codes"
import { jsonContent } from "stoker/openapi/helpers"
import {
  createItemSchema,
  itemSchema,
  listItemsQuerySchema,
  paginatedItemsSchema,
} from "./schema"

export const listItemsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Items"],
  summary: "List items",
  middleware: [requireRoles([ROLES.ORGANIZER])] as const,
  request: { query: listItemsQuerySchema },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(paginatedItemsSchema, "Paginated items"),
  }),
})

export const getItemRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Items"],
  summary: "Get item by ID",
  middleware: [requireRoles([ROLES.ORGANIZER])] as const,
  request: { params: idParamSchema },
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(itemSchema, "Item found"),
    [StatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Not found"),
  }),
})

export const createItemRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Items"],
  summary: "Create item",
  middleware: [requireRoles([ROLES.ORGANIZER])] as const,
  request: { body: jsonContent(createItemSchema, "Item data") },
  responses: createAuthResponses({
    [StatusCodes.CREATED]: jsonContent(itemSchema, "Item created"),
  }),
})

export const deleteItemRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Items"],
  summary: "Delete item",
  middleware: [requireRoles([ROLES.ORGANIZER])] as const,
  request: { params: idParamSchema },
  responses: createAuthResponses({
    [StatusCodes.NO_CONTENT]: { description: "Item deleted" },
    [StatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Not found"),
  }),
})
```

## 3. `controller.ts`

Thin — calls the service, returns the response. No business logic.

```typescript
import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { $$item } from "@lootopia/api/services/item.service"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"
import type {
  createItemRoute,
  deleteItemRoute,
  getItemRoute,
  listItemsRoute,
} from "./doc"

export const listItemsController: RouteHandler<
  typeof listItemsRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const items = await $$item.list(user.id, req.valid("query"))
  return json(items, StatusCodes.OK)
}

export const getItemController: RouteHandler<
  typeof getItemRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const { id } = req.valid("param")
  const item = await $$item.getById(id)

  if (!item) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  return json(item, StatusCodes.OK)
}

export const createItemController: RouteHandler<
  typeof createItemRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const item = await $$item.create(user.id, req.valid("json"))
  return json(item, StatusCodes.CREATED)
}

export const deleteItemController: RouteHandler<
  typeof deleteItemRoute,
  AuthenticatedContext
> = async ({ req, json }) => {
  const { id } = req.valid("param")
  await $$item.delete(id)
  return json(null as never, StatusCodes.NO_CONTENT)
}
```

## 4. `route.ts`

Wiring only — no logic. Sub-routers mounted with `.route("/", subRouter)`.

```typescript
import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"
import {
  createItemController,
  deleteItemController,
  getItemController,
  listItemsController,
} from "./controller"
import {
  createItemRoute,
  deleteItemRoute,
  getItemRoute,
  listItemsRoute,
} from "./doc"

const itemsRouter = createRouter<AuthenticatedContext>()
  .openapi(listItemsRoute, listItemsController)
  .openba(createItemRoute, createItemController)
  .openba(getItemRoute, getItemController)
  .openba(deleteItemRoute, deleteItemController)

export default itemsRouter
```

## 5. Register in the main router

In `packages/api/src/routes/route.ts`:

```typescript
import itemsRouter from "@lootopia/api/routes/items/route"

router.route("/items", itemsRouter)
```

---

## Request Validation

| Type         | In `doc.ts`                                      | In `controller.ts`   |
| ------------ | ------------------------------------------------ | -------------------- |
| Path params  | `request: { params: idParamSchema }`             | `req.valid("param")` |
| Query params | `request: { query: z.object({...}) }`            | `req.valid("query")` |
| Body         | `request: { body: jsonContent(schema, "desc") }` | `req.valid("json")`  |
