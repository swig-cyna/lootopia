Fais une revue de code adversariale du diff staged (`git diff --staged`) et des fichiers modifiés (`git status`).

Vérifie chaque point ci-dessous selon le type de fichier concerné. Pour chaque problème trouvé, indique : le fichier + numéro de ligne, ce qui est faux, et comment le corriger.

---

## Frontend — Styling (`packages/dashboard/` ou `packages/mobile/`)

- [ ] Pas de `style={{}}` inline sauf valeur dynamique impossible à exprimer en Tailwind
- [ ] Pas de classes raw (`bg-white`, `text-gray-900`, `border-gray-200`) — utiliser les tokens sémantiques (`bg-card`, `text-foreground`, `border-border`)
- [ ] Pas de `rounded-2xl` / `rounded-3xl` sur des containers ou cards — rester dans `rounded-sm` → `rounded-xl`
- [ ] `rounded-full` uniquement pour avatars, icon buttons, pill badges
- [ ] Pas de concaténation de strings pour les classNames — utiliser `cn` depuis `@/lib/utils`
- [ ] Icônes uniquement depuis `lucide-react` — pas d'autres librairies d'icônes
- [ ] Composants UI : vérifier si un shadcn/ui équivalent existe avant tout custom

## Frontend — Architecture

- [ ] Les composants feature ne sont importés que via leur `index.ts`, jamais en profondeur
- [ ] Un composant complexe (sous-composants, state partagé) est dans un dossier dédié avec `index.tsx` + `Context.tsx`
- [ ] Les sous-composants d'un composant complexe sont préfixés du nom du parent (`UserAvatarImage`, `UserAvatarMenu`)
- [ ] Un composant utilisé dans 2+ features est dans `src/components/`, pas dans une feature
- [ ] Une page ne contient pas de logique métier — elle compose des features
- [ ] Les hooks génériques (sans logique métier) sont dans `src/hooks/`, pas dans une feature
- [ ] Un composant avec 3+ `useState`/`useEffect` ou des `useCallback`/`useMemo` lourds extrait sa logique dans un hook `use[ComponentName].ts` placé à côté du composant
- [ ] `index.tsx` d'un composant complexe ne contient que du JSX — pas de `useState`, `useEffect`, `useCallback` directement dedans
- [ ] Le hook custom porte le nom du composant préfixé de `use` : `useHuntForm`, `useUserAvatar`

## Frontend — Data Fetching

- [ ] `useQuery` et `useMutation` importés depuis `@lootopia/dashboard/lib/api`, pas depuis `@tanstack/react-query` directement
- [ ] Les clés de cache construites avec `getQueryKey(api.endpoint)` — jamais de clés manuelles en dur
- [ ] Invalidation via `invalidate()` (du `useQuery`) ou `queryClient.invalidateQueries({ queryKey: getQueryKey(...) })`
- [ ] `useMutation` destructuré en tuple `const [mutate, { isPending }]`
- [ ] Arguments de mutation : `{ json: data }`, `{ param: { id } }`, `{ query: {...} }`

## Frontend — Formulaires

- [ ] Schema Zod dans `features/[feature]/schema/` — jamais inline dans le composant
- [ ] `useForm` typé avec le type inféré du schema : `useForm<MonType>`
- [ ] `zodResolver` ou `standardSchemaResolver` utilisé — jamais de validation manuelle
- [ ] Erreurs affichées via `<FieldError errors={[errors.champ]} />` — pas de `<p>` custom
- [ ] Erreurs serveur via `setError('root', ...)` et affichées avec `errors.root`
- [ ] Composants `Field`, `FieldGroup`, `FieldLabel`, `FieldError` utilisés pour structurer le form

## Backend — Architecture des routes

- [ ] Chaque route a exactement 4 fichiers : `schema.ts`, `doc.ts`, `controller.ts`, `route.ts`
- [ ] `route.ts` ne contient que du câblage `.openapi(route, controller)` — zéro logique métier
- [ ] Les controllers sont typés `RouteHandler<typeof maRoute, AuthenticatedContext>`
- [ ] Inputs validés via `req.valid("json")`, `req.valid("param")`, `req.valid("query")` — jamais `req.json()` directement
- [ ] Status codes depuis `stoker/http-status-codes` — jamais de nombres en dur (`200`, `404`, etc.)
- [ ] Phrases d'erreur depuis `stoker/http-status-phrases` si nécessaire

## Backend — Auth

- [ ] Routes protégées avec `middleware: [requireAuth]` ou `middleware: [requireRoles([ROLES.xxx])]`
- [ ] Routes protégées utilisent `createAuthResponses({...})` — pas de 401/403 manuels dans les responses
- [ ] `security: [{ bearerAuth: [] }]` présent sur les routes protégées dans `doc.ts`
- [ ] Accès à l'utilisateur via `c.var.user` ou destructuré `{ var: { user } }`

---

Format de sortie :

**Si tout est correct :** "✅ Revue OK — aucun problème détecté."

**Si des problèmes sont trouvés :**
```
❌ [fichier:ligne] — Description du problème
→ Correction : ce qu'il faudrait écrire à la place
```

Trie les problèmes par sévérité : erreurs d'architecture d'abord, puis conventions, puis style.
