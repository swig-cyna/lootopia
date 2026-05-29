# Auth — `@lootopia/auth`

Better Auth configuration shared between the API (server) and both frontends (client).

## Table of Contents

- [Server](server.md) — Better Auth server config, mounting in Hono
- [Client](client.md) — `createClient`, session, sign-in/out, dashboard access guard

## Exports

```typescript
// Server-side only (API)
import { auth } from "@lootopia/auth/server"
import { ac } from "@lootopia/auth/server"

// Client-side (dashboard, mobile)
import { createClient } from "@lootopia/auth/client"

// Shared (anywhere)
import { ROLES } from "@lootopia/auth/constants"
import type { Role } from "@lootopia/auth/constants"
```

## Roles

```typescript
export const ROLES = {
  PLAYER: "player", // default on sign-up — plays hunts (mobile)
  ORGANIZER: "organizer", // creates and manages hunts (dashboard)
  ADMIN: "admin", // full access, bypasses all role checks
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
```

## Environment Variables

| Variable             | Description                            |
| -------------------- | -------------------------------------- |
| `BETTER_AUTH_SECRET` | Encryption key for sessions and tokens |
| `WEB_BASE_URL`       | Base URL used for auth callbacks       |
