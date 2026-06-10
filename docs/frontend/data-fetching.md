# Data Fetching

Both packages expose a typed Hono client and custom React Query hooks from `lib/api.ts`.

## `useQuery`

```typescript
import { api, useQuery } from "@lootopia/dashboard/lib/api"

const { data, isLoading, invalidate } = useQuery(api.hunts, {
  query: { page: "1", limit: "20", sort: "recent" },
})
```

- Cache key is derived automatically from the request URL + query params
- `invalidate()` is returned alongside the data — no need to call `queryClient.invalidateQueries` manually
- Pass `enabled: false` to disable the query conditionally

```typescript
const { data } = useQuery(api.hunts[":huntId"].$get, {
  param: { huntId: id },
  enabled: !!id,
})
```

## `useMutation`

```typescript
import { api, useMutation } from "@lootopia/dashboard/lib/api"

const [createHunt, { isPending }] = useMutation(api.hunts.$post, {
  onSuccess: (data) => navigate(`/hunt/${data.id}/edit`),
  onError: (err) => console.error(err),
})

createHunt({ json: { title, description, points, reward } })
```

Returns a tuple `[mutate, { isPending, isError, ... }]`.

### Cache invalidation after a mutation

```typescript
const { data, invalidate } = useQuery(api.hunts, { query: { page: "1" } })

const [updateStatus] = useMutation(api.hunts[":huntId"].status.$patch, {
  onSuccess: () => invalidate(),
})
```

## `useInfiniteQuery` (mobile only)

```typescript
import { api, useInfiniteQuery } from "@lootopia/mobile/lib/api"

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery(api.hunts.published, { query: {} })

const hunts = data?.pages.flatMap((page) => page.data) ?? []
```

Pagination is driven by `metadata.hasNext` from the API response. The next page param is incremented automatically.

Trigger `fetchNextPage` with an `IntersectionObserver` on a sentinel element:

```typescript
import { useIntersectionObserver } from "@lootopia/mobile/hooks/useIntersectionObserver"

const sentinelRef = useRef<HTMLDivElement>(null)

useIntersectionObserver(sentinelRef, () => {
  if (hasNextPage && !isFetchingNextPage) fetchNextPage()
})

return (
  <>
    {hunts.map((hunt) => <HuntCard key={hunt.id} hunt={hunt} />)}
    <div ref={sentinelRef} />
  </>
)
```

## React Query Config

```typescript
// lib/queryClient.ts
new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // No automatic retries
      placeholderData: keepPreviousData, // Soft transition during refetch
    },
  },
})
```
