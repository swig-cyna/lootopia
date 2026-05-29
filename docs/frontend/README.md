# Frontend — Dashboard & Mobile

Both frontends share the same stack and conventions. The differences are audience and feature set.

| Package               | Audience            | URL (dev)              |
| --------------------- | ------------------- | ---------------------- |
| `@lootopia/dashboard` | Organizers / Admins | https://localhost:3001 |
| `@lootopia/mobile`    | Players             | https://localhost:3002 |

## Table of Contents

- [Routing](routing.md) — React Router config, ProtectedRoute, layouts
- [Data Fetching](data-fetching.md) — `useQuery`, `useMutation`, `useInfiniteQuery`, React Query config
- [Forms](forms.md) — `FormProvider`, `useFormContext`, Field components, validation

## Stack

- **React** + **TypeScript**
- **React Router** — declarative routing
- **React Query** — server state (fetching, caching, mutations)
- **react-hook-form** + **Zod** — forms and validation
- **Tailwind CSS** + **shadcn/ui** — styling (see `/styling` skill)
- **Mapbox GL JS** — maps (mobile only)
- **Better Auth** — session via `@lootopia/auth/client` (see [docs/auth/client.md](../auth/client.md))

## Folder Structure

```
src/
├── components/
│   └── ui/              # shadcn/ui components (button, card, input, field, ...)
├── features/            # Feature-based architecture
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── schema/
│       ├── utils/
│       └── context/
├── hooks/               # Generic shared hooks (useDebouncedValue, useIntersectionObserver)
├── lib/
│   ├── api.ts           # Hono client + useQuery / useMutation / useInfiniteQuery
│   ├── queryClient.ts   # React Query config
│   └── utils.ts         # cn() for Tailwind class merging
├── pages/               # Route entry points — thin, no business logic
└── router.tsx           # React Router declarative config
```

## Features Overview

### Dashboard

| Feature | Description                                                                                |
| ------- | ------------------------------------------------------------------------------------------ |
| `auth`  | Sign-in form, ProtectedRoute (blocks players)                                              |
| `hunt`  | HuntList (table + filters + pagination), HuntForm (create/edit with map + points + reward) |

### Mobile

| Feature   | Description                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| `auth`    | Sign-in form, ProtectedRoute                                                                                       |
| `account` | Profile edit, email change, password change                                                                        |
| `hunts`   | Explore (browse published hunts), MyHunts (infinite scroll), HuntSession (in-game overlay), GameSheet (quiz/AR UI) |
| `map`     | Mapbox canvas, geolocation marker, hunt point markers                                                              |
| `games`   | Balloon AR game                                                                                                    |

## Adding a shadcn/ui Component

Always run from the monorepo root with the `-c` flag:

```bash
pnpm dlx shadcn@latest add dialog -c packages/dashboard
pnpm dlx shadcn@latest add sheet  -c packages/mobile
```
