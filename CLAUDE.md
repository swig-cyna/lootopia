# Lootopia — Claude Guidelines

## Structure du monorepo

```
packages/
├── api/        # Backend Hono — @lootopia/api
├── auth/       # Better Auth — @lootopia/auth
├── db/         # Kysely + migrations — @lootopia/db
├── dashboard/  # Frontend React (organisateurs) — @lootopia/dashboard
└── mobile/     # Frontend React (joueurs) — @lootopia/mobile
```

## Commandes pnpm

```bash
pnpm dev                        # Lance tout en parallèle
pnpm dev:api                    # API seulement
pnpm dev:dashboard              # Dashboard seulement
pnpm dev:mobile                 # Mobile seulement
pnpm lint                       # Lint tous les packages
pnpm lint:fix                   # Lint + autofix tous les packages
pnpm format                     # Vérifie le formatage (prettier)
pnpm format:fix                 # Formate tous les packages
pnpm kysely migrate:make 'nom'  # Créer une migration
pnpm kysely migrate:latest      # Appliquer les migrations
```

## Frontend

@.claude/styling.md
@.claude/frontend-architecture.md
@.claude/data-fetching.md
@.claude/forms.md
@.claude/mapbox.md

## Backend

@.claude/backend-architecture.md
