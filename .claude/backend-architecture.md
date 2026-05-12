# Backend API — Architecture & Conventions

## Stack

- **Framework** : Hono avec `@hono/zod-openapi`
- **Validation** : Zod (via `@hono/zod-openapi`)
- **Status codes** : `stoker/http-status-codes` et `stoker/http-status-phrases`
- **Auth** : `@lootopia/auth` (Better Auth)

---

## Structure d'une route

Chaque route a son propre dossier avec exactement 4 fichiers :

```
packages/api/src/routes/your-route/
├── schema.ts      # schémas Zod de validation
├── doc.ts         # définitions OpenAPI des routes
├── controller.ts  # logique métier des handlers
└── route.ts       # assembly : relie doc + controller dans le router
```

### 1. `schema.ts` — Schémas Zod

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

### 2. `doc.ts` — Définitions OpenAPI

```typescript
import { createRoute } from "@hono/zod-openapi"
import { errorResponseSchema, idParamSchema } from "@lootopia/api/utils/responses"
import { itemSchema, createItemSchema } from "@lootopia/api/routes/your-route/schema"
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

### 3. `controller.ts` — Logique métier

Les controllers sont des fonctions typées `RouteHandler` — jamais de logique inline dans `route.ts`.

```typescript
import { type RouteHandler } from "@hono/zod-openapi"
import { type AuthenticatedContext } from "@lootopia/api/lib/hono"
import * as StatusCodes from "stoker/http-status-codes"
import type { getItemsRoute, createItemRoute } from "@lootopia/api/routes/your-route/doc"

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

`route.ts` ne contient que du câblage — pas de logique.

```typescript
import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { getItemsController, createItemController } from "@lootopia/api/routes/your-route/controller"
import { getItemsRoute, createItemRoute } from "@lootopia/api/routes/your-route/doc"

const itemsRouter = createRouter<AuthenticatedContext>()
  .openapi(getItemsRoute, getItemsController)
  .openapi(createItemRoute, createItemController)

export default itemsRouter
```

### 5. Enregistrer dans le router principal

Dans `packages/api/src/routes/route.ts` :

```typescript
import itemsRouter from "@lootopia/api/routes/your-route/route"

router.route("/items", itemsRouter)
```

---

## Validation des inputs

| Type | Dans `doc.ts` | Dans `route.ts` |
|---|---|---|
| Path params | `request: { params: idParamSchema }` | `c.req.valid("param")` |
| Query params | `request: { query: z.object({...}) }` | `c.req.valid("query")` |
| Body | `request: { body: jsonContent(schema, "desc") }` | `c.req.valid("json")` |

---

## Authentification & Rôles

### Middlewares disponibles

```typescript
import { requireAuth, requireRoles } from "@lootopia/api/middlewares/auth.middlewares"
import { ROLES } from "@lootopia/auth"

// Juste authentifié
middleware: [requireAuth]

// Rôle spécifique
middleware: [requireRoles([ROLES.ORGANIZER])]
middleware: [requireRoles([ROLES.ADMIN])]
```

### Hiérarchie des rôles

- `ROLES.ADMIN` → accès à tout, bypasse tous les checks
- `ROLES.ORGANIZER` → organisateur de chasses
- `ROLES.PLAYER` → joueur standard

### Accéder à l'utilisateur dans un handler

```typescript
const user = c.var.user
```

### Vérification manuelle dans un handler

```typescript
if (!user) {
  return c.json({ error: "Unauthorized" }, StatusCodes.UNAUTHORIZED)
}

if (user.role !== ROLES.ADMIN && user.id !== resourceOwnerId) {
  return c.json({ error: "Forbidden" }, StatusCodes.FORBIDDEN)
}
```

---

## Helper `createAuthResponses`

Pour toute route protégée, utilise `createAuthResponses` au lieu de répéter les 401/403 manuellement.

```typescript
import { createAuthResponses } from "@lootopia/api/utils/responses"

// ✅ Correct
responses: createAuthResponses({
  [StatusCodes.OK]: jsonContent(schema, "Success"),
  [StatusCodes.NOT_FOUND]: jsonContent(errorResponseSchema, "Not found"),
})

// ❌ Incorrect — répétition manuelle
responses: {
  [StatusCodes.OK]: jsonContent(schema, "Success"),
  [StatusCodes.UNAUTHORIZED]: jsonContent(errorResponseSchema, "Unauthorized"),
  [StatusCodes.FORBIDDEN]: jsonContent(errorResponseSchema, "Forbidden"),
}
```

Ajoute automatiquement `401` et `403`.
À utiliser dès qu'une route a `requireAuth` ou `requireRoles` ou `security: [{ bearerAuth: [] }]`.

---

## Bonnes pratiques

- Toujours valider les inputs avec Zod
- Toujours utiliser `stoker` pour les status codes, jamais de nombres en dur
- Garder les handlers fins — la logique métier va ailleurs (services, utils)
- Ajouter des `tags` OpenAPI pour grouper les endpoints
