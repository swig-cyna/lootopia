# Auth Server

Used only in `packages/api`. Never import `@lootopia/auth/server` in frontend packages.

## Mounting in Hono

```typescript
import { auth } from "@lootopia/auth/server"

// In packages/api/src/index.ts
app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
```

Auth routes are then available at `/auth/*` (e.g. `/auth/sign-in/email`, `/auth/session`).

## Configuration Summary

| Setting                 | Value                                                               |
| ----------------------- | ------------------------------------------------------------------- |
| Auth strategy           | Email + password                                                    |
| Password length         | 8–25 characters                                                     |
| Default role on sign-up | `player`                                                            |
| Database                | PostgreSQL via Kysely dialect from `@lootopia/db`                   |
| Admin plugin            | Enabled — role management via API                                   |
| OpenAPI plugin          | Auth schema exposed at `/auth/reference`                            |
| Cookie (production)     | `sameSite: "none"`, `secure: true`, `partitioned: true`             |
| Cookie (development)    | `sameSite: "lax"`, `secure: false`                                  |
| Origin check            | Disabled (`disableOriginCheck: true`) — required for cross-port dev |

## Why these cookie settings?

In production, the dashboard and API are on different domains — cross-site cookies require `sameSite: "none"` + `secure: true`. The `partitioned` flag is required by Chrome for third-party cookies (CHIPS).

In development, frontends run on `localhost:3001/3002` and the API on `localhost:3000`. Since they share the same hostname, `sameSite: "lax"` is enough and HTTP works fine.

`disableOriginCheck: true` prevents Better Auth from rejecting requests that come from a different port in development.

## Access Control Object

The `ac` export is the Better Auth access control instance. It's used by the API middlewares to check role permissions:

```typescript
import { ac } from "@lootopia/auth/server"
```

Roles and their permissions are defined in `packages/auth/src/server.ts`. `ROLES.ADMIN` inherits all admin plugin statements and bypasses all route-level checks.
