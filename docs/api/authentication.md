# Authentication & Authorization

Complete guide for implementing authentication and role-based access control in API routes.

## Table of Contents

- [Role-Based Access Control](#role-based-access-control)
- [Route-Specific Ownership Middleware](#route-specific-ownership-middleware)
- [Authentication Responses Helper](#authentication-responses-helper)

---

## Role-Based Access Control

### Available Roles

Roles are defined in `packages/auth/src/constants.ts`:

```typescript
import { ROLES } from "@lootopia/auth/constants"

ROLES.PLAYER // Standard player
ROLES.ORGANIZER // Hunt organizer
ROLES.ADMIN // Administrator — bypasses all role checks
```

### Role Hierarchy

The `requireRoles` middleware implements a simple hierarchy:

- `ROLES.ADMIN` automatically has access to all routes
- Other users must have one of the specified roles (403 otherwise)

### Applying Middlewares in `doc.ts`

```typescript
import {
  requireAuth,
  requireRoles,
} from "@lootopia/api/middlewares/auth.middlewares"
import { ROLES } from "@lootopia/auth/constants"

// Authenticated only
middleware: [requireAuth] as const

// Specific role
middleware: [requireRoles([ROLES.ORGANIZER])] as const

// Multiple allowed roles
middleware: [requireRoles([ROLES.ORGANIZER, ROLES.ADMIN])] as const
```

> `as const` is required after every `middleware` array.

### Accessing the User in a Controller

```typescript
export const myController: RouteHandler<
  typeof myRoute,
  AuthenticatedContext
> = async ({ json, var: { user } }) => {
  // user is guaranteed non-null when requireAuth or requireRoles is used
  const items = await $$item.list(user.id)
  return json(items, StatusCodes.OK)
}
```

### Manual Role Check in a Handler

For custom authorization logic inside a controller:

```typescript
import { ROLES } from "@lootopia/auth/constants"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

if (user.role !== ROLES.ADMIN && user.id !== resourceOwnerId) {
  return json({ error: StatusPhrases.FORBIDDEN }, StatusCodes.FORBIDDEN)
}
```

---

## Route-Specific Ownership Middleware

When multiple routes on the same resource need to verify ownership, extract the check into a `middlewares.ts` file. This fetches the resource, checks ownership, and injects it into the context so controllers don't repeat the lookup.

### `middlewares.ts`

```typescript
import type { AuthenticatedContext } from "@lootopia/api/lib/hono"
import { type Hunt, $hunt } from "@lootopia/db/repositories/hunt.repository"
import type { MiddlewareHandler } from "hono"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

export type HuntOwnerContext = AuthenticatedContext & {
  Variables: { hunt: Hunt }
}

export const requireHuntOwner: MiddlewareHandler<HuntOwnerContext> = async (
  { req, json, set, var: { user } },
  next,
) => {
  const id = req.param("huntId")!
  const hunt = await $hunt.byId(id)

  if (!hunt) {
    return json({ error: StatusPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
  }

  if (hunt.organizerId !== user.id) {
    return json({ error: StatusPhrases.FORBIDDEN }, StatusCodes.FORBIDDEN)
  }

  set("hunt", hunt)

  return next()
}
```

### Using the Extended Context in `doc.ts`

```typescript
import { requireHuntOwner } from "./middlewares"

export const getHuntRoute = createRoute({
  method: "get",
  path: "/{huntId}",
  tags: ["Hunts"],
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner] as const,
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(huntSchema, "Hunt found"),
    [StatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Not found"),
  }),
})
```

### Using the Extended Context in `controller.ts`

```typescript
import type { HuntOwnerContext } from "./middlewares"

export const getHuntController: RouteHandler<
  typeof getHuntRoute,
  HuntOwnerContext // ← gives access to c.var.hunt
> = async ({ json, var: { hunt } }) => {
  return json(hunt, StatusCodes.OK)
}
```

---

## Authentication Responses Helper

Use `createAuthResponses` on every protected route to avoid repeating 401/403 manually.

### Problem

```typescript
responses: {
  [StatusCodes.OK]: jsonContent(schema, "Success"),
  [StatusCodes.UNAUTHORIZED]: jsonContent(errorResponseSchema, "Unauthorized"),
  [StatusCodes.FORBIDDEN]: jsonContent(errorResponseSchema, "Insufficient permissions"),
}
```

### Solution

```typescript
import { createAuthResponses } from "@lootopia/api/utils/responses"

responses: createAuthResponses({
  [StatusCodes.OK]: jsonContent(schema, "Success"),
})
// → automatically adds 401 and 403
```

### When to Use

Use `createAuthResponses` whenever a route has:

- `middleware: [requireAuth]`
- `middleware: [requireRoles([...])]`
- A route-specific ownership middleware (e.g. `requireHuntOwner`)

For public routes with no authentication, use a plain response object.

### With Multiple Responses

```typescript
responses: createAuthResponses({
  [StatusCodes.OK]: jsonContent(itemSchema, "Item found"),
  [StatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Not found"),
})
// Result: 200 + 404 + 401 (auto) + 403 (auto)
```
