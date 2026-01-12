# Creating Routes

This guide explains how to create new API routes in the Lootopia backend.

## Route Structure

Each route should have its own folder with three files:

```
packages/api/src/routes/your-route/
├── schema.ts    # Zod validation schemas
├── doc.ts        # OpenAPI route definitions
└── route.ts      # Route handlers
```

## Step-by-Step Guide

### 1. Create Route Folder

```bash
mkdir packages/api/src/routes/your-route
```

### 2. Create Schemas (`schema.ts`)

Define your Zod schemas for validation:

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

export const itemListSchema = z.array(itemSchema)
```

### 3. Create OpenAPI Documentation (`doc.ts`)

Define your route configurations with OpenAPI specs:

```typescript
import { createRoute, z } from "@hono/zod-openapi"
import {
  errorResponseSchema,
  idParamSchema,
} from "@lootopia/api/utils/responses"
import {
  createItemSchema,
  itemSchema,
  itemListSchema,
} from "@lootopia/api/routes/your-route/schema"
import * as StatusCodes from "stoker/http-status-codes"
import { jsonContent } from "stoker/openapi/helpers"

export const getItemsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Items"],
  summary: "Get all items",
  description: "Retrieve a list of all items",
  responses: {
    [StatusCodes.OK]: jsonContent(itemListSchema, "List of items"),
  },
})

export const getItemByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Items"],
  summary: "Get item by ID",
  description: "Retrieve a single item by its ID",
  request: {
    params: idParamSchema,
  },
  responses: {
    [StatusCodes.OK]: jsonContent(itemSchema, "Item found"),
    [StatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Item not found"),
  },
})

export const createItemRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Items"],
  summary: "Create item",
  description: "Create a new item",
  request: {
    body: jsonContent(createItemSchema, "Item data"),
  },
  responses: {
    [StatusCodes.CREATED]: jsonContent(itemSchema, "Item created"),
    [StatusCodes.BAD_REQUEST]: jsonContent(errorResponseSchema, "Invalid data"),
  },
})
```

### 4. Create Route Handlers (`route.ts`)

Implement your route logic:

```typescript
import { OpenAPIHono } from "@hono/zod-openapi"
import { HonoContext } from "@lootopia/api/lib/hono"
import {
  getItemsRoute,
  getItemByIdRoute,
  createItemRoute,
} from "@lootopia/api/routes/your-route/doc"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

const itemsRouter = new OpenAPIHono<HonoContext>()

itemsRouter.openapi(getItemsRoute, async (c) => {
  const items = [
    {
      id: "1",
      name: "Item 1",
      description: null,
      createdAt: new Date().toISOString(),
    },
  ]

  return c.json(items, StatusCodes.OK)
})

itemsRouter.openapi(getItemByIdRoute, async (c) => {
  const { id } = c.req.valid("param")

  const item = {
    id,
    name: "Item 1",
    description: null,
    createdAt: new Date().toISOString(),
  }

  if (!item) {
    return c.json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  return c.json(item, StatusCodes.OK)
})

itemsRouter.openapi(createItemRoute, async (c) => {
  const data = c.req.valid("json")

  const newItem = {
    id: "generated-id",
    ...data,
    createdAt: new Date().toISOString(),
  }

  return c.json(newItem, StatusCodes.CREATED)
})

export default itemsRouter
```

### 5. Register Route in Main Router

Add your route to `packages/api/src/routes/route.ts`:

```typescript
import { OpenAPIHono } from "@hono/zod-openapi"
import { HonoContext } from "@lootopia/api/lib/hono"
import testRouter from "@lootopia/api/routes/test/route"
import itemsRouter from "@lootopia/api/routes/your-route/route"

const router = new OpenAPIHono<HonoContext>()

router.get("/", (c) => {
  return c.text("API Route")
})

router.route("/test", testRouter)
router.route("/items", itemsRouter)

export default router
```

## Request Validation

### Path Parameters

```typescript
request: {
  params: z.object({
    id: z.string(),
  }),
}
```

Access in handler: `c.req.valid("param")`

### Query Parameters

```typescript
request: {
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
}
```

Access in handler: `c.req.valid("query")`

### Body

```typescript
request: {
  body: jsonContent(createItemSchema, "Item data"),
}
```

Access in handler: `c.req.valid("json")`

## Response Codes

Use constants from `stoker`:

```typescript
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

return c.json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
```

## Best Practices

2. **Validate all inputs** with Zod schemas
3. **Return proper status codes** for all scenarios
4. **Add OpenAPI tags** to group related endpoints
5. **Keep handlers thin** - move business logic elsewhere if complex
