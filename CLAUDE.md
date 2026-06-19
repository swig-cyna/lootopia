# Lootopia — Claude Guidelines

## Monorepo Structure

```
packages/
├── api/        # Hono backend — @lootopia/api
├── auth/       # Better Auth — @lootopia/auth
├── common/     # Shared constants & Zod schemas — @lootopia/common
├── db/         # Kysely + migrations — @lootopia/db
├── dashboard/  # React frontend (organizers) — @lootopia/dashboard
└── mobile/     # React frontend (players) — @lootopia/mobile
```

## pnpm Commands

```bash
pnpm dev                        # Start everything in parallel
pnpm dev:api                    # API only
pnpm dev:web                    # Web (landing) only
pnpm dev:dashboard              # Dashboard only
pnpm dev:mobile                 # Mobile only
pnpm build                      # Build all packages
pnpm start                      # Start all packages (prod)
pnpm clean                      # Remove dist + node_modules everywhere
pnpm lint                       # Lint all packages (oxlint)
pnpm lint:fix                   # Lint + autofix all packages
pnpm format                     # Check formatting (prettier)
pnpm format:fix                 # Format all packages
pnpm kysely migrate:make 'name' # Create a migration
pnpm kysely migrate:latest      # Apply migrations
pnpm prod:up                    # Build and start production Docker stack
pnpm prod:down                  # Stop production Docker stack
```

## Coding Conventions

The following conventions apply to **all code written in this project**, always.

@.claude/skills/code-quality/SKILL.md
@.claude/skills/frontend-architecture/SKILL.md
@.claude/skills/backend-architecture/SKILL.md

---

## Available Skills

| Skill                    | Description                                                                      |
| ------------------------ | -------------------------------------------------------------------------------- |
| `/styling`               | Tailwind, shadcn/ui, Lucide icons, theme tokens                                  |
| `/frontend-architecture` | Feature-based architecture, components, hooks, context                           |
| `/data-fetching`         | React Query + Hono Client, useQuery, useMutation                                 |
| `/forms`                 | react-hook-form + Zod, FormProvider, Field components                            |
| `/mapbox`                | Mapbox GL JS, markers, SearchBox                                                 |
| `/backend-architecture`  | Hono + zod-openapi, route structure, auth middlewares                            |
| `/code-quality`          | Named handlers, curry functions, early returns, lookup objects, no prop drilling |
| `/doc`                   | Update `docs/` to reflect current code — run after changes to any package        |
