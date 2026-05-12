# Data Fetching — React Query + Hono Client

## Client API

Le client est un wrapper typé autour de Hono Client, disponible dans `@lootopia/dashboard/lib/api` et `@lootopia/mobile/lib/api`.

```typescript
import { api, useQuery, useMutation, getQueryKey } from '@lootopia/dashboard/lib/api'
import queryClient from '@lootopia/dashboard/lib/queryClient'
```

- `api` → client Hono typé, miroir exact des routes backend
- `useQuery` → wrapper de `@tanstack/react-query` avec `invalidate()` intégré
- `useMutation` → retourne `[mutateAsync, rest]` en tuple
- `getQueryKey` → génère la clé React Query à partir d'un endpoint `api`

---

## useQuery

```typescript
const { data, isLoading, invalidate } = useQuery(api.hunts, {
  // options react-query optionnelles
  enabled: true,
})

// Avec params
const { data } = useQuery(api.hunts[':id'], { param: { id: '123' } })

// Invalider le cache depuis le composant
invalidate()
```

**Config par défaut du queryClient :**
- `retry: 0` — pas de retry automatique
- `staleTime: 60_000` — données fraîches pendant 1 minute
- `placeholderData: keepPreviousData` — garde les données précédentes pendant le chargement

---

## useMutation

Retourne un tuple `[mutateAsync, rest]`.

```typescript
const [createHunt, { isPending }] = useMutation(api.hunts.$post, {
  onError: (err) => console.error(err),
  onSuccess: () => invalidate(),
})

// Appel
await createHunt({ json: data })
await createHunt({ param: { id: '123' }, json: data })
```

**Formes d'arguments selon la route :**
- Body JSON → `{ json: data }`
- Path param → `{ param: { id: '...' } }`
- Query param → `{ query: { page: '1' } }`

---

## Pattern : query + invalidation après mutation

```typescript
const { data: hunts, invalidate } = useQuery(api.hunts)

const [deleteHunt] = useMutation(api.hunts[':id'].$delete, {
  onSuccess: () => invalidate(),
})
```

---

## Invalidation via getQueryKey + queryClient

Deux façons d'accéder au queryClient selon le contexte :

### Dans un composant React → `useQueryClient`

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@lootopia/dashboard/lib/api'

const queryClient = useQueryClient()

const [createHunt] = useMutation(api.hunts.$post, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: getQueryKey(api.hunts) })
  },
})
```

### En dehors d'un composant (hook utilitaire, callback externe) → import direct

```typescript
import { getQueryKey } from '@lootopia/dashboard/lib/api'
import queryClient from '@lootopia/dashboard/lib/queryClient'

queryClient.invalidateQueries({ queryKey: getQueryKey(api.hunts) })
```

**Règle :** dans un composant, toujours préférer `useQueryClient()` — c'est la façon idiomatique React Query. L'import direct est réservé à l'extérieur de l'arbre React. Dans les deux cas, toujours construire les clés avec `getQueryKey(api.monEndpoint)` — jamais de clés manuelles en dur.

---

## Gestion des erreurs

Les erreurs 401 redirigent automatiquement vers `/signin` (géré dans `lib/api.ts`).
Les autres erreurs HTTP sont throwées comme `Error` avec le message du backend.
Capture via `onError` dans `useMutation` ou `useQuery`.
