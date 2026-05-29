---
name: backend-architecture
description: Backend API architecture — Hono, zod-openapi, route structure, services, mappers, middlewares, pagination, auth. Use when the user asks about creating a route, API endpoint, backend controller, service, authentication, or backend architecture.
---

# Backend API — Architecture & Conventions

## Stack

- **Framework**: Hono with `@hono/zod-openapi`
- **Validation**: Zod (via `@hono/zod-openapi`)
- **Status codes**: `stoker/http-status-codes` and `stoker/http-status-phrases`
- **Auth**: `@lootopia/auth` (Better Auth)

---

## Route structure

A simple route has 4 files. A complex route (with business logic, ownership checks, or sub-routes) can have up to 6 files plus sub-folders:

```
packages/api/src/routes/your-route/
├── schema.ts        # Zod schemas (request + response)
├── doc.ts           # OpenAPI route definitions
├── controller.ts    # HTTP handlers — thin, calls the service
├── route.ts         # Assembly: connects doc + controller + sub-routers
├── mappers.ts       # (optional) DB model → API response transformations
├── middlewares.ts   # (optional) route-specific middlewares & context types
└── sub-resource/   # (optional) sub-routes mounted in route.ts
    ├── doc.ts
    ├── controller.ts
    └── route.ts
```

### 1. `schema.ts` — Zod Schemas

```typescript
import { z } from "@hono/zod-openapi"

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
```

### 2. `doc.ts` — OpenAPI Definitions

```typescript
import { createRoute } from "@hono/zod-openapi"
import {
  createAuthResponses,
  errorResponseSchema,
  idParamSchema,
} from "@lootopia/api/utils/responses"
import {
  itemSchema,
  createItemSchema,
} from "@lootopia/api/routes/your-route/schema"
import * as StatusCodes from "stoker/http-status-codes"
import { jsonContent } from "stoker/openapi/helpers"

export const getItemsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Items"],
  summary: "Get all items",
  middleware: [requireRoles([ROLES.ORGANIZER])] as const,
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(itemSchema, "List of items"),
  }),
})
```

### 3. `controller.ts` — HTTP handlers

Controllers are typed `RouteHandler` functions — thin by design. All business logic goes in the service. Never call DB repositories directly from a controller.

```typescript
import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { $$item } from "@lootopia/api/services/item.service"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"
import type {
  getItemsRoute,
  createItemRoute,
  deleteItemRoute,
} from "@lootopia/api/routes/your-route/doc"

export const getItemsController: RouteHandler<
  typeof getItemsRoute,
  AuthenticatedContext
> = async ({ json, var: { user } }) => {
  const items = await $$item.list(user.id)
  return json(items, StatusCodes.OK)
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
> = async ({ json }) => {
  await $$item.delete(/* ... */)
  return json({ success: true }, StatusCodes.NO_CONTENT)
}
```

### 4. `route.ts` — Assembly

`route.ts` contains only wiring — no logic. Sub-routers are mounted with `.route("/", subRouter)`.

```typescript
import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"
import {
  getItemsController,
  createItemController,
} from "@lootopia/api/routes/your-route/controller"
import {
  getItemsRoute,
  createItemRoute,
} from "@lootopia/api/routes/your-route/doc"
import subResourceRouter from "@lootopia/api/routes/your-route/sub-resource/route"

const itemsRouter = createRouter<AuthenticatedContext>()
  .openapi(createItemRoute, createItemController)
  .route("/", subResourceRouter) // mount sub-routes
  .openba(getItemsRoute, getItemsController)

export default itemsRouter
```

### 5. Register in the main router

In `packages/api/src/routes/route.ts`:

```typescript
import itemsRouter from "@lootopia/api/routes/your-route/route"

router.route("/items", itemsRouter)
```

---

## Services layer

Business logic lives in `packages/api/src/services/`. Controllers never call DB repositories directly — they always go through a service.

**Naming convention:** service objects use a `$$` prefix (e.g. `$$hunt`, `$$item`).

```typescript
// packages/api/src/services/item.service.ts
import { $item } from "@lootopia/db/repositories/item.repository"
import { paginate } from "@lootopia/api/utils/responses"
import { mapItemDetail } from "@lootopia/api/routes/items/mappers"
import type { z } from "@hono/zod-openapi"
import type { createItemSchema } from "@lootopia/api/routes/items/schema"

type CreateItemData = z.infer<typeof createItemSchema>
type PaginationQuery = { page: number; limit: number }

export const $$item = {
  async list(userId: string, query: PaginationQuery) {
    const { data, total } = await $item.byUser(userId, query)
    return paginate(data.map(mapItemDetail), total, query.page, query.limit)
  },

  async create(userId: string, data: CreateItemData) {
    const item = await $item.create({ ...data, userId })
    return mapItemDetail(item)
  },

  async delete(itemId: string) {
    await $item.delete(itemId)
  },
}
```

**Rules:**

- One service file per resource: `item.service.ts`, `hunt.service.ts`
- Helper functions in the same file (private, not exported)
- Repos from `@lootopia/db/repositories/*.repository`

---

## Mappers

When a DB model needs transformation before being sent as a response (renaming fields, hiding sensitive data, restructuring nested data), use a `mappers.ts` file in the route folder.

```typescript
// packages/api/src/routes/items/mappers.ts
import type { $item } from "@lootopia/db/repositories/item.repository"

export type ItemWithDetails = NonNullable<
  Awaited<ReturnType<typeof $item.byIdWithDetails>>
>

// For organizers — full data
export const mapItemDetail = (item: ItemWithDetails) => ({
  id: item.id,
  name: item.name,
  secretData: item.secret, // visible to organizer
})

// For players — sensitive fields hidden
export const mapItemDetailPlayer = (item: ItemWithDetails) => {
  const { secret: _secret, ...rest } = item
  return rest
}
```

**Rules:**

- Mappers are pure functions — no side effects, no DB calls
- Always derive input types from the repository return types (`NonNullable<Awaited<ReturnType<...>>>`)
- Used only in the service layer, never in controllers

---

## Route-specific middlewares

When a route needs to fetch a resource and verify ownership before the handler runs, create a `middlewares.ts` in the route folder.

```typescript
// packages/api/src/routes/items/middlewares.ts
import type { AuthenticatedContext } from "@lootopia/api/lib/hono"
import { type Item, $item } from "@lootopia/db/repositories/item.repository"
import type { MiddlewareHandler } from "hono"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

export type ItemOwnerContext = AuthenticatedContext & {
  Variables: { item: Item }
}

export const requireItemOwner: MiddlewareHandler<ItemOwnerContext> = async (
  { req, json, set, var: { user } },
  next,
) => {
  const id = req.param("itemId")!
  const item = await $item.byId(id)

  if (!item) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  if (item.userId !== user.id) {
    return json({ error: StatusPhrases.FORBIDDEN }, StatusCodes.FORBIDDEN)
  }

  set("item", item)

  return next()
}
```

Then use the extended context type in the controller:

```typescript
// controller.ts
import type { ItemOwnerContext } from "./middlewares"

export const getItemController: RouteHandler<
  typeof getItemRoute,
  ItemOwnerContext // ← extended context gives access to c.var.item
> = async ({ json, var: { item } }) => {
  return json(item, StatusCodes.OK)
}
```

---

## Pagination

Use the pagination helpers from `@lootopia/api/utils/responses` for any list endpoint.

### In `schema.ts`

```typescript
import {
  createPaginatedResponseSchema,
  paginationParamsSchema,
} from "@lootopia/api/utils/responses"

export const listItemsQuerySchema = paginationParamsSchema.extend({
  search: z.string().optional(),
})

export const paginatedItemsSchema = createPaginatedResponseSchema(itemSchema)
```

### In `doc.ts`

```typescript
request: {
  query: listItemsQuerySchema
}
responses: createAuthResponses({
  [StatusCodes.OK]: jsonContent(paginatedItemsSchema, "Paginated items"),
})
```

### In the service

```typescript
import { paginate } from "@lootopia/api/utils/responses"
import { paginateQuery } from "@lootopia/db/utils"

const { data, total } = await paginateQuery(
  $item.query(),
  query.page,
  query.limit,
)
return paginate(data, total, query.page, query.limit)
```

**`paginate()` returns:**

```typescript
{
  data: T[],
  metadata: {
    page, limit, total, totalPages, hasNext, hasPrev
  }
}
```

---

## Input validation

| Type         | In `doc.ts`                                      | In `controller.ts`   |
| ------------ | ------------------------------------------------ | -------------------- |
| Path params  | `request: { params: idParamSchema }`             | `req.valid("param")` |
| Query params | `request: { query: z.object({...}) }`            | `req.valid("query")` |
| Body         | `request: { body: jsonContent(schema, "desc") }` | `req.valid("json")`  |

---

## Authentication & Roles

### Available middlewares

```typescript
import {
  requireAuth,
  requireRoles,
} from "@lootopia/api/middlewares/auth.middlewares"
import { ROLES } from "@lootopia/auth/constants"

// Just authenticated
middleware: [requireAuth] as const

// Specific role
middleware: [requireRoles([ROLES.ORGANIZER])] as const
middleware: [requireRoles([ROLES.ADMIN])] as const
```

### Role hierarchy

- `ROLES.ADMIN` → access to everything, bypasses all checks
- `ROLES.ORGANIZER` → hunt organizer
- `ROLES.PLAYER` → standard player

### Accessing the user in a handler

```typescript
const { user } = c.var
```

### Manual check in a handler

```typescript
if (!user) {
  return c.json({ error: StatusPhrases.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED)
}

if (user.role !== ROLES.ADMIN && user.id !== resourceOwnerId) {
  return c.json({ error: StatusPhrases.FORBIDDEN }, StatusCodes.FORBIDDEN)
}
```

---

## Response helpers

All from `@lootopia/api/utils/responses`:

| Export                               | Purpose                                                         |
| ------------------------------------ | --------------------------------------------------------------- |
| `errorResponseSchema`                | `{ error: string, details?: unknown }`                          |
| `successResponseSchema`              | `{ success: boolean, message?: string }`                        |
| `idParamSchema`                      | Path param `{ id: string }`                                     |
| `paginationParamsSchema`             | Query params `page` (default 1) + `limit` (default 20, max 100) |
| `paginationMetadataSchema`           | Metadata shape for paginated responses                          |
| `createPaginatedResponseSchema`      | Factory: wraps a schema in `{ data: T[], metadata }`            |
| `paginate(data, total, page, limit)` | Builds the paginated response object                            |
| `createAuthResponses(responses)`     | Adds 401 + 403 to a response map                                |

### `createAuthResponses`

Use whenever a route has `requireAuth`, `requireRoles`, or a route-specific ownership middleware.

```typescript
// ✅ Correct
responses: createAuthResponses({
  [StatusCodes.OK]: jsonContent(schema, "Success"),
  [StatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Not found"),
})

// ❌ Incorrect — manual repetition
responses: {
  [StatusCodes.OK]: jsonContent(schema, "Success"),
  [StatusCodes.UNAUTHORIZED]: jsonContent(errorResponseSchema, "Unauthorized"),
  [StatusCodes.FORBIDDEN]: jsonContent(errorResponseSchema, "Forbidden"),
}
```

---

## Status phrases

Always use `StatusPhrases` for error message strings — never hardcode raw strings.

```typescript
import * as StatusPhrases from "stoker/http-status-phrases"

return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
return json({ error: StatusPhrases.FORBIDDEN }, StatusCodes.FORBIDDEN)
```

---

## Best practices

- Controllers are thin — all logic in the service
- Never call DB repositories from controllers, only from services
- Mappers transform DB models → API shapes; use them only in services
- Use `StatusPhrases` for all error message strings
- Always use `stoker` for status codes, never hardcoded numbers
- Add OpenAPI `tags` to group endpoints
- `as const` is required after the `middleware` array in `createRoute`
