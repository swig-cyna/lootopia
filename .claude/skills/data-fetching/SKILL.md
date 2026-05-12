---
name: data-fetching
description: Data fetching — React Query, Hono Client, useQuery, useMutation, cache invalidation. Use when the user asks about fetching data, API calls, React Query, mutations, or cache invalidation in the frontend.
---

# Data Fetching — React Query + Hono Client

## API Client

The client is a typed wrapper around Hono Client, available in `@lootopia/dashboard/lib/api` and `@lootopia/mobile/lib/api`.

```typescript
import {
  api,
  useQuery,
  useMutation,
  getQueryKey,
} from "@lootopia/dashboard/lib/api"
import queryClient from "@lootopia/dashboard/lib/queryClient"
```

- `api` → typed Hono client, exact mirror of the backend routes
- `useQuery` → wrapper around `@tanstack/react-query` with built-in `invalidate()`
- `useMutation` → returns `[mutateAsync, rest]` as a tuple
- `getQueryKey` → generates the React Query key from an `api` endpoint

---

## useQuery

```typescript
const { data, isLoading, invalidate } = useQuery(api.hunts, {
  // optional react-query options
  enabled: true,
})

// With params
const { data } = useQuery(api.hunts[":id"], { param: { id: "123" } })

// Invalidate the cache from the component
invalidate()
```

**Default queryClient config:**

- `retry: 0` — no automatic retry
- `staleTime: 60_000` — data stays fresh for 1 minute
- `placeholderData: keepPreviousData` — keeps previous data while loading

---

## useMutation

Returns a tuple `[mutateAsync, rest]`.

```typescript
const [createHunt, { isPending }] = useMutation(api.hunts.$post, {
  onError: (err) => console.error(err),
  onSuccess: () => invalidate(),
})

// Call
await createHunt({ json: data })
await createHunt({ param: { id: "123" }, json: data })
```

**Argument forms depending on the route:**

- JSON body → `{ json: data }`
- Path param → `{ param: { id: '...' } }`
- Query param → `{ query: { page: '1' } }`

---

## Pattern: query + invalidation after mutation

```typescript
const { data: hunts, invalidate } = useQuery(api.hunts)

const [deleteHunt] = useMutation(api.hunts[":id"].$delete, {
  onSuccess: () => invalidate(),
})
```

---

## Invalidation via getQueryKey + queryClient

Two ways to access the queryClient depending on context:

### Inside a React component → `useQueryClient`

```typescript
import { useQueryClient } from "@tanstack/react-query"
import { getQueryKey } from "@lootopia/dashboard/lib/api"

const queryClient = useQueryClient()

const [createHunt] = useMutation(api.hunts.$post, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: getQueryKey(api.hunts) })
  },
})
```

### Outside a component (utility hook, external callback) → direct import

```typescript
import { getQueryKey } from "@lootopia/dashboard/lib/api"
import queryClient from "@lootopia/dashboard/lib/queryClient"

queryClient.invalidateQueries({ queryKey: getQueryKey(api.hunts) })
```

**Rule:** inside a component, always prefer `useQueryClient()` — it's the idiomatic React Query approach. The direct import is reserved for outside the React tree. In both cases, always build keys with `getQueryKey(api.myEndpoint)` — never hardcode manual keys.

---

## Error handling

401 errors automatically redirect to `/signin` (handled in `lib/api.ts`).
Other HTTP errors are thrown as `Error` with the backend message.
Catch via `onError` in `useMutation` or `useQuery`.
