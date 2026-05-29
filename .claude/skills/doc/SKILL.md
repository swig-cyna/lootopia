---
name: doc
description: Update project documentation to reflect the current state of the codebase. Compares recent git changes against existing docs and rewrites what's stale. Use when the user asks to update, sync, or write documentation.
---

# Doc — Update Documentation

## What to do

The user wants the docs in `docs/` to reflect the current code.

**Argument:** `$ARGUMENTS` — optional, names the area to document (e.g. `api`, `db`, `auth`, `frontend`, `common`). If empty, infer the area from recent git changes or ask.

## Steps

### 1. Identify what changed

```bash
git diff HEAD~5..HEAD --stat -- packages/
```

Map changed packages to their doc folder:

| Package changed           | Doc to update                           |
| ------------------------- | --------------------------------------- |
| `packages/api/src/`       | `docs/api/`                             |
| `packages/db/src/`        | `docs/db/` + `docs/database-schema.mmd` |
| `packages/auth/src/`      | `docs/auth/`                            |
| `packages/dashboard/src/` | `docs/frontend/`                        |
| `packages/mobile/src/`    | `docs/frontend/`                        |
| `packages/common/src/`    | `docs/common/`                          |

### 2. Read the current code

Read the relevant source files to understand what actually exists now — never rely on memory. Key files per area:

- **api** → `packages/api/src/routes/`, `packages/api/src/services/`, `packages/api/src/utils/responses.ts`, `packages/api/src/lib/hono.ts`
- **db** → `packages/db/src/repositories/`, `packages/db/src/migrations/`, `packages/db/src/schema.ts`, `packages/db/src/utils.ts`
- **auth** → `packages/auth/src/server.ts`, `packages/auth/src/client.ts`, `packages/auth/src/constants.ts`
- **frontend** → `packages/dashboard/src/lib/api.ts`, `packages/mobile/src/lib/api.ts`, routers, feature folders
- **common** → `packages/common/src/constants/`, `packages/common/src/schemas/`

### 3. Read the existing docs

Read every file in the relevant `docs/` subfolder before writing anything.

### 4. Identify gaps

Compare code vs docs. Look for:

- New files, exports, or functions not mentioned
- Renamed or removed things still documented
- Changed patterns (new conventions, new helpers)
- Missing tables, routes, or schema columns

### 5. Update the docs

Edit only what's stale — don't rewrite sections that are still accurate.

For `docs/database-schema.mmd`: read all migration files in order and reconstruct the full schema if columns or tables changed.

## Rules

- Never invent content — only document what actually exists in the code
- Keep the same file structure (don't merge or split files unless asked)
- Match the tone and format of existing docs in the same folder
- Update the `README.md` table of contents if files are added or renamed
