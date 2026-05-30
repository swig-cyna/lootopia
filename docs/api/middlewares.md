# Ownership Middlewares

When multiple routes on the same resource need to verify that the authenticated user owns it, extract the check into a `middlewares.ts` file.

The middleware fetches the resource, checks ownership, sets it on the context, and calls `next()` — so controllers receive the resource without repeating the DB lookup.

---

## `middlewares.ts`

```typescript
import type { AuthenticatedContext } from "@lootopia/api/lib/hono"
import { type Hunt, $hunt } from "@lootopia/db/repositories/hunt.repository"
import type { MiddlewareHandler } from "hono"
import * as StatusCodes from "stoker/http-status-codes"
import * as StatusPhrases from "stoker/http-status-phrases"

// Extend the context to expose the fetched resource
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

---

## Using it in `doc.ts`

```typescript
import { requireHuntOwner } from "./middlewares"

export const getHuntRoute = createRoute({
  method: "get",
  path: "/{huntId}",
  tags: ["Hunts"],
  middleware: [requireRoles([ROLES.ORGANIZER]), requireHuntOwner] as const,
  responses: createAuthResponses({
    [StatusCodes.OK]: jsonContent(huntSchema, "Hunt"),
    [StatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Not found"),
  }),
})
```

---

## Using it in `controller.ts`

Use the extended context type to get type-safe access to `c.var.hunt`:

```typescript
import type { HuntOwnerContext } from "./middlewares"

export const getHuntController: RouteHandler<
  typeof getHuntRoute,
  HuntOwnerContext // ← not AuthenticatedContext
> = async ({ json, var: { hunt } }) => {
  return json(hunt, StatusCodes.OK)
}
```
