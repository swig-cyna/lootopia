# Authentication & Authorization

Complete guide for implementing authentication and role-based access control in your API routes.

## Table of Contents

- [Role-Based Access Control](#role-based-access-control)
  - [Available Roles](#available-roles)
  - [Role Hierarchy](#role-hierarchy)
  - [Manual Role Verification](#manual-role-verification)
- [Authentication Responses Helper](#authentication-responses-helper)
  - [Problem](#problem)
  - [Solution](#solution)
  - [Examples](#examples)
  - [Type Safety](#type-safety)
  - [When to Use](#when-to-use)

---

## Role-Based Access Control

### Available Roles

Roles defined in `utils/constants.ts`:
- `ROLES.USER` - Standard user
- `ROLES.PARTNER` - Partner
- `ROLES.ADMIN` - Administrator (has access to everything)

### Role Hierarchy

The `requireRoles` middleware implements a simple hierarchy:
- `ROLES.ADMIN` automatically has access to all routes
- Other users must have one of the specified roles

### Manual Role Verification

For custom logic in a handler:

```typescript
import { ROLES } from "@lootopia/api/utils/constants"

router.openapi(someRoute, async (c) => {
  const user = c.var.user

  if (!user) {
    return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED)
  }

  if (user.role !== ROLES.ADMIN && user.id !== resourceOwnerId) {
    return c.json({ error: "Forbidden" }, StatusCodes.FORBIDDEN)
  }

  // Logic
})
```

---

## Authentication Responses Helper

Avoid repeating authentication error responses in your route definitions.

### Problem

When creating protected routes, you need to add the same authentication error responses repeatedly:

```typescript
responses: {
  [StatusCodes.OK]: jsonContent(schema, "Success"),
  [StatusCodes.UNAUTHORIZED]: jsonContent(errorResponseSchema, "Unauthorized"),
  [StatusCodes.FORBIDDEN]: jsonContent(errorResponseSchema, "Insufficient permissions"),
}
```

### Solution

Use the `createAuthResponses` helper from `utils/responses.ts`:

```typescript
import { createAuthResponses } from "@lootopia/api/utils/responses"

responses: createAuthResponses({
  [StatusCodes.OK]: jsonContent(schema, "Success"),
})
```

This automatically adds:
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions

### Examples

#### Before

```typescript
import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import { ROLES } from "@lootopia/api/utils/constants"
import { errorResponseSchema } from "@lootopia/api/utils/responses"
import * as StatusCodes from "stoker/http-status-codes"
import { jsonContent } from "stoker/openapi/helpers"

export const deleteItemRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Items"],
  summary: "Delete item",
  middleware: [requireRoles([ROLES.ADMIN])],
  security: [{ bearerAuth: [] }],
  responses: {
    [StatusCodes.OK]: jsonContent(successResponseSchema, "Item deleted"),
    [StatusCodes.UNAUTHORIZED]: jsonContent(errorResponseSchema, "Unauthorized"),
    [StatusCodes.FORBIDDEN]: jsonContent(errorResponseSchema, "Insufficient permissions"),
  },
})
```

#### After

```typescript
import { createRoute } from "@hono/zod-openapi"
import { requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import { ROLES } from "@lootopia/api/utils/constants"
import { createAuthResponses } from "@lootopia/api/utils/responses"
import * as StatusCodes from "stoker/http-status-codes"
import { jsonContent } from "stoker/openapi/helpers"

export const deleteItemRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Items"],
  summary: "Delete item",
  middleware: [requireRoles([ROLES.ADMIN])],
  security: [{ bearerAuth: [] }],
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(successResponseSchema, "Item deleted"),
  }),
})
```

#### Multiple Success Responses

Works with multiple success responses:

```typescript
responses: createAuthResponses({
  [StatusCodes.OK]: jsonContent(itemSchema, "Item found"),
  [StatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Item not found"),
})
```

Result includes:
- `200 OK` - Item found
- `404 Not Found` - Item not found
- `401 Unauthorized` - Authentication required (added automatically)
- `403 Forbidden` - Insufficient permissions (added automatically)

### Type Safety

The helper maintains full TypeScript type safety. All response schemas are properly typed.

### When to Use

Use `createAuthResponses` for any route with:
- `middleware: [loggedInMiddleware]`
- `middleware: [requireRoles([...])]`
- `security: [{ bearerAuth: [] }]`

For public routes without authentication, use regular response objects.
