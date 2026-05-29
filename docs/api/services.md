# Services & Mappers

## Services

Business logic lives in `packages/api/src/services/`. Controllers never call DB repositories directly — they go through a service.

**Naming:** service objects use a `$$` prefix (`$$hunt`, `$$item`).

```typescript
// packages/api/src/services/item.service.ts
import { z } from "@hono/zod-openapi"
import { mapItemDetail } from "@lootopia/api/routes/items/mappers"
import { paginate } from "@lootopia/api/utils/responses"
import { $item } from "@lootopia/db/repositories/item.repository"
import { paginateQuery } from "@lootopia/db/utils"
import type {
  createItemSchema,
  listItemsQuerySchema,
} from "@lootopia/api/routes/items/schema"

type CreateItemData = z.infer<typeof createItemSchema>
type ListItemsQuery = z.infer<typeof listItemsQuerySchema>

export const $$item = {
  async list(userId: string, query: ListItemsQuery) {
    const { data, total } = await paginateQuery(
      $item.byUser(userId),
      query.page,
      query.limit,
    )
    return paginate(data.map(mapItemDetail), total, query.page, query.limit)
  },

  async getById(itemId: string) {
    return $item.byId(itemId)
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
- Private helpers (not exported) live in the same file
- Repos imported from `@lootopia/db/repositories/*.repository`

---

## Mappers

When a DB model needs transformation before being sent as a response (rename fields, hide sensitive data, reshape nested data), create a `mappers.ts` in the route folder.

```typescript
// packages/api/src/routes/items/mappers.ts
import type { $item } from "@lootopia/db/repositories/item.repository"

// Derive the input type from the repo return — never write it manually
export type ItemWithDetails = NonNullable<
  Awaited<ReturnType<typeof $item.byIdWithDetails>>
>

// For organizers — full data
export const mapItemDetail = (item: ItemWithDetails) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  createdAt: item.createdAt,
  // secretField intentionally excluded
})

// For players — sensitive fields stripped
export const mapItemDetailPlayer = (item: ItemWithDetails) => {
  const { secret: _secret, ...rest } = item
  return rest
}
```

**Rules:**

- Pure functions — no side effects, no DB calls
- Input types derived from repo return types (`NonNullable<Awaited<ReturnType<...>>>`)
- Called only from the service layer, never from controllers
