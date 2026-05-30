# Database — `@lootopia/db`

Kysely ORM over PostgreSQL. Provides the typed `db` instance, repositories, migrations, and query utilities.

## Table of Contents

- [Repositories](repositories.md) — `$repository` pattern, available repos, special cases
- [Migrations & Utilities](migrations.md) — create/run migrations, `paginateQuery`, `safeIn`

## Exports

```typescript
import { db } from "@lootopia/db" // Kysely instance
import { $hunt } from "@lootopia/db/repositories/hunt.repository" // Repository
import { paginateQuery, safeIn } from "@lootopia/db/utils" // Query helpers
```

## Schema

```
user                       # Better Auth managed
session                    # Better Auth managed
account                    # Better Auth managed (OAuth)
verification               # Better Auth managed

hunts                      # Hunt metadata
  id, title, description, status (draft|published), organizerId, createdAt, updatedAt

hunt_points                # GPS coordinates + game type
  id, huntId, latitude, longitude, position, gameType (quiz|ar), arId, createdAt

hunt_rewards               # One reward per hunt
  id, huntId, topX, promoCode

quiz_questions             # One per hunt_point with gameType=quiz
  id, huntPointId, question, answers (JSON array), correctAnswerIndex

hunt_participations        # User joins a hunt
  id, huntId, userId, joinedAt

hunt_point_completions     # User validates a point
  id, huntParticipationId, huntPointId, score, completedAt
```
