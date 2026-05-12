---
name: backend-architecture
description: Backend API architecture — Hono, zod-openapi, route structure, controllers, auth middlewares, roles. Use when the user asks about creating a route, API endpoint, backend controller, authentication, or backend architecture.
---

# Backend API — Architecture & Conventions

## Stack

- **Framework**: Hono with `@hono/zod-openapi`
- **Validation**: Zod (via `@hono/zod-openapi`)
- **Status codes**: `stoker/http-status-codes` and `stoker/http-status-phrases`
- **Auth**: `@lootopia/auth` (Better Auth)

---

## Route structure

Each route has its own folder with exactly 4 files:

```
packages/api/src/routes/your-route/
├── schema.ts      # Zod validation schemas
├── doc.ts         # OpenAPI route definitions
├── controller.ts  # handler business logic
└── route.ts       # assembly: connects doc + controller in the router
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
  responses: {
    [StatusCodes.OK]: jsonContent(itemSchema, "List of items"),
  },
})
```

### 3. `controller.ts` — Business logic

Controllers are typed `RouteHandler` functions — never inline logic in `route.ts`.

```typescript
import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import * as StatusCodes from "stoker/http-status-codes"
import type {
  getItemsRoute,
  createItemRoute,
} from "@lootopia/api/routes/your-route/doc"

export const getItemsController: RouteHandler<
  typeof getItemsRoute,
  AuthenticatedContext
> = async ({ json }) => {
  const items = await $item.findAll()
  return json(items, StatusCodes.OK)
}

export const createItemController: RouteHandler<
  typeof createItemRoute,
  AuthenticatedContext
> = async ({ req, json, var: { user } }) => {
  const { name, description } = req.valid("json")
  const item = await $item.create({ name, description, userId: user.id })
  return json(item, StatusCodes.CREATED)
}
```

### 4. `route.ts` — Assembly

`route.ts` contains only wiring — no logic.

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

const itemsRouter = createRouter<AuthenticatedContext>()
  .openapi(getItemsRoute, getItemsController)
  .openapi(createItemRoute, createItemController)

export default itemsRouter
```

### 5. Register in the main router

In `packages/api/src/routes/route.ts`:

```typescript
import itemsRouter from "@lootopia/api/routes/your-route/route"

router.route("/items", itemsRouter)
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
import { ROLES } from "@lootopia/auth"

// Just authenticated
middleware: [requireAuth]

// Specific role
middleware: [requireRoles([ROLES.ORGANIZER])]
middleware: [requireRoles([ROLES.ADMIN])]
```

### Role hierarchy

- `ROLES.ADMIN` → access to everything, bypasses all checks
- `ROLES.ORGANIZER` → hunt organizer
- `ROLES.PLAYER` → standard player

### Accessing the user in a handler

```typescript
const user = c.var.user
```

### Manual check in a handler

```typescript
if (!user) {
  return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED)
}

if (user.role !== ROLES.ADMIN && user.id !== resourceOwnerId) {
  return c.json({ error: "Forbidden" }, StatusCodes.FORBIDDEN)
}
```

---

## `createAuthResponses` helper

For any protected route, use `createAuthResponses` instead of repeating 401/403 manually.

```typescript
import { createAuthResponses } from "@lootopia/api/utils/responses"

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

Automatically adds `401` and `403`.
Use whenever a route has `requireAuth`, `requireRoles`, or `security: [{ bearerAuth: [] }]`.

---

## Best practices

- Always validate inputs with Zod
- Always use `stoker` for status codes, never hardcoded numbers
- Keep handlers thin — business logic goes elsewhere (services, utils)
- Add OpenAPI `tags` to group endpoints
