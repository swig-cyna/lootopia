# Repositories

All DB access goes through repository objects. No raw `db` calls in services or controllers.

## Pattern

Each repository is a plain object of async functions, prefixed with `$`:

```typescript
// packages/db/src/repositories/hunt.repository.ts
export type Hunt = Selectable<HuntTable>
export type NewHunt = Insertable<HuntTable>
export type HuntUpdate = Updateable<HuntTable>

export const $hunt = {
  byId: (id: string) =>
    db.selectFrom("hunts").where("id", "=", id).selectAll().executeTakeFirst(),

  create: (hunt: NewHunt) =>
    db
      .insertInto("hunts")
      .values(hunt)
      .returningAll()
      .executeTakeFirstOrThrow(),

  update: (id: string, hunt: HuntUpdate) =>
    db
      .updateTable("hunts")
      .set(hunt)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow(),

  delete: (id: string) => db.deleteFrom("hunts").where("id", "=", id).execute(),
}
```

**Conventions:**

- Object named `$entityName` (dollar prefix)
- Always export `Selectable<T>`, `Insertable<T>`, `Updateable<T>` for type use in services
- End queries with `.execute()`, `.executeTakeFirst()`, or `.executeTakeFirstOrThrow()`

---

## Available Repositories

| Import path                                                  | Object                 | Entity                        |
| ------------------------------------------------------------ | ---------------------- | ----------------------------- |
| `@lootopia/db/repositories/hunt.repository`                  | `$hunt`                | Hunt metadata                 |
| `@lootopia/db/repositories/hunt-point.repository`            | `$huntPoint`           | Hunt points (GPS + game type) |
| `@lootopia/db/repositories/hunt-reward.repository`           | `$huntReward`          | Reward (promo code + topX)    |
| `@lootopia/db/repositories/quiz-question.repository`         | `$quizQuestion`        | Quiz questions + answers      |
| `@lootopia/db/repositories/hunt-participation.repository`    | `$huntParticipation`   | User joining a hunt           |
| `@lootopia/db/repositories/hunt-point-completion.repository` | `$huntPointCompletion` | Point validated by a user     |
| `@lootopia/db/repositories/hunt-reward-claim.repository`     | `$huntRewardClaim`     | Reward claimed by a user      |
| `@lootopia/db/repositories/hunt-stats.repository`            | `$huntStats`           | Analytics queries (counts, rankings, funnels) |

---

## Special Cases

### `quiz_questions.answers` — JSON array

The `answers` column is stored as JSON in PostgreSQL. The `$quizQuestion` repository handles serialization transparently — pass a plain `string[]`, the repo `JSON.stringify`s it on insert and parse on read.

```typescript
await $quizQuestion.create([
  {
    huntPointId: "...",
    question: "What color is the sky?",
    answers: ["Red", "Blue", "Green"], // string[] — no manual JSON.stringify needed
    correctAnswerIndex: 1,
  },
])
```

### Nested JSON queries

`$hunt.byIdWithDetails` and similar methods use Kysely's `jsonArrayFrom` / `jsonObjectFrom` to return nested data in a single query — no N+1:

```typescript
const hunt = await $hunt.byIdWithDetails(id)
// hunt.points[]         — pre-joined
// hunt.points[].quizQuestion — pre-joined
// hunt.reward           — pre-joined
```

Derive the return type from the repository function when you need it in a mapper or service:

```typescript
export type HuntWithDetails = NonNullable<
  Awaited<ReturnType<typeof $hunt.byIdWithDetails>>
>
```
