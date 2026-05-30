# Migrations & Query Utilities

## Migrations

```bash
pnpm kysely migrate:latest       # Apply all pending migrations
pnpm kysely migrate:make name    # Create a new timestamped migration file
```

Migration files live in `packages/db/src/migrations/`. Each file must export `up` and `down`:

```typescript
import { type Kysely } from "kysely"

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("items")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute()
}

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("items").execute()
}
```

Use the `/migration` skill to generate a correctly structured migration file.

---

## Query Utilities

From `@lootopia/db/utils`. Used in services alongside repository calls.

### `paginateQuery(query, page, limit)`

Runs a paginated query and returns both data and total count in a single round-trip.

```typescript
import { paginateQuery } from "@lootopia/db/utils"

const { data, total } = await paginateQuery(
  db.selectFrom("hunts").where("organizerId", "=", userId).selectAll(),
  query.page,
  query.limit,
)
// data: T[]
// total: number — pass to paginate() from @lootopia/api/utils/responses
```

Then pass the result to `paginate()` from the API layer:

```typescript
import { paginate } from "@lootopia/api/utils/responses"

return paginate(data, total, query.page, query.limit)
```

### `safeIn(eb, column, values)`

Builds a SQL `IN` clause safely. Returns `false` (no results) when the values array is empty, avoiding invalid SQL.

```typescript
import { safeIn } from "@lootopia/db/utils"

// Safe — works even if huntIds is []
db.selectFrom("hunt_points")
  .where((eb) => safeIn(eb, "huntId", huntIds))
  .selectAll()

  // ❌ Without safeIn — crashes with empty array
  .where("huntId", "in", []) // invalid SQL
```
