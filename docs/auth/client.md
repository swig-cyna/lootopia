# Auth Client

Used in `packages/dashboard` and `packages/mobile`. Each frontend creates its own instance.

## Setup

```typescript
// features/auth/utils/auth-client.ts
import { createClient } from "@lootopia/auth/client"

const authClient = createClient(window.location.origin)
export default authClient
```

`createClient` is a factory — it takes the frontend's base URL and returns a typed Better Auth React client with the admin plugin included.

## Session

```typescript
const { data: session, isPending } = authClient.useSession()

// Available on session.user:
session?.user.id
session?.user.email
session?.user.name
session?.user.role // "player" | "organizer" | "admin"
```

`useSession` is a React hook — it fetches and caches the current session. `isPending` is `true` on first load.

## Sign In

```typescript
await authClient.signIn.email(
  { email, password },
  {
    onSuccess: (ctx) => {
      // ctx.data.user.role is available here
    },
    onError: (ctx) => {
      // ctx.error.message contains the reason
    },
  },
)
```

## Sign Out

```typescript
await authClient.signOut()
```

## Dashboard Access Guard

The dashboard restricts access to organizers and admins. Players are blocked at two levels:

### 1. Sign-in (`SigninForm.tsx`)

After a successful login, if the user's role is `ROLES.PLAYER`:

- Call `authClient.signOut()` immediately
- Show an error: "Access restricted to organizers."

### 2. Route guard (`ProtectedRoute.tsx`)

On every protected route, if `session.user.role === ROLES.PLAYER` → redirect to `/signin`.

This acts as a safety net for players who might have an existing session (e.g. from the mobile app) and try to access a dashboard URL directly.
