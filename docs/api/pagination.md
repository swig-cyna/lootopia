# Pagination

All list endpoints use the same helpers from `@lootopia/api/utils/responses` and `@lootopia/db/utils`.

---

## In `schema.ts`

```typescript
import {
  createPaginatedResponseSchema,
  paginationParamsSchema,
} from "@lootopia/api/utils/responses"

// Extend with route-specific filters
export const listItemsQuerySchema = paginationParamsSchema.extend({
  search: z.string().optional(),
  sort: z.enum(["recent", "oldest", "title"]).optional(),
})

// Wrap the item schema in { data: T[], metadata }
export const paginatedItemsSchema = createPaginatedResponseSchema(itemSchema)
```

`paginationParamsSchema` provides `page` (default 1) and `limit` (default 20, max 100), both as strings that are transformed to numbers.

---

## In `doc.ts`

```typescript
request: {
  query: listItemsQuerySchema
}

responses: createAuthResponses({
  [StatusCodes.OK]: jsonContent(paginatedItemsSchema, "Paginated items"),
})
```

---

## In the service

```typescript
import { paginate } from "@lootopia/api/utils/responses"
import { paginateQuery } from "@lootopia/db/utils"

async list(userId: string, query: ListItemsQuery) {
  const { data, total } = await paginateQuery(
    $item.byUser(userId),   // Kysely query builder (not yet executed)
    query.page,
    query.limit,
  )
  return paginate(data.map(mapItemDetail), total, query.page, query.limit)
}
```

`paginateQuery` runs the query and returns `{ data, total }` in a single round-trip.

`paginate` builds the response shape:

```typescript
{
  data: T[],
  metadata: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
```

---

## Reference

| Export                          | From                            | Purpose                                       |
| ------------------------------- | ------------------------------- | --------------------------------------------- |
| `paginationParamsSchema`        | `@lootopia/api/utils/responses` | Query params `page` + `limit` with defaults   |
| `createPaginatedResponseSchema` | `@lootopia/api/utils/responses` | Wraps a schema in `{ data: T[], metadata }`   |
| `paginate(data, total, p, l)`   | `@lootopia/api/utils/responses` | Builds the paginated response object          |
| `paginateQuery(query, p, l)`    | `@lootopia/db/utils`            | Runs query + count, returns `{ data, total }` |
