Do an adversarial code review of the staged diff (`git diff --staged`) and modified files (`git status`).

Check each point below according to the type of file involved. For each problem found, indicate: the file + line number, what is wrong, and how to fix it.

---

## Frontend — Styling (`packages/dashboard/` or `packages/mobile/`)

- [ ] No inline `style={{}}` except for dynamic values that cannot be expressed in Tailwind
- [ ] No raw color classes (`bg-white`, `text-gray-900`, `border-gray-200`) — use semantic tokens (`bg-card`, `text-foreground`, `border-border`)
- [ ] No `rounded-2xl` / `rounded-3xl` on containers or cards — stay within `rounded-sm` → `rounded-xl`
- [ ] `rounded-full` only for avatars, icon buttons, pill badges
- [ ] No string concatenation for classNames — use `cn` from `@/lib/utils`
- [ ] Icons only from `lucide-react` — no other icon libraries
- [ ] UI components: check if a shadcn/ui equivalent exists before building anything custom

## Frontend — Architecture

- [ ] Feature components are only imported via their `index.ts`, never deep-linked
- [ ] A complex component (sub-components, shared state) lives in a dedicated folder with `index.tsx` + `Context.tsx`
- [ ] Sub-components of a complex component are prefixed with the parent name (`UserAvatarImage`, `UserAvatarMenu`)
- [ ] A component used in 2+ features lives in `src/components/`, not inside a feature
- [ ] A page contains no business logic — it only composes features
- [ ] Generic hooks (no business logic) live in `src/hooks/`, not inside a feature
- [ ] A component with 3+ `useState`/`useEffect` or heavy `useCallback`/`useMemo` extracts its logic into a `use[ComponentName].ts` hook
- [ ] `index.tsx` of a complex component contains only JSX — no `useState`, `useEffect`, `useCallback` directly inside
- [ ] The custom hook is named after the component prefixed with `use`: `useHuntForm`, `useUserAvatar`

## Frontend — Data Fetching

- [ ] `useQuery` and `useMutation` imported from `@lootopia/dashboard/lib/api`, not directly from `@tanstack/react-query`
- [ ] Cache keys built with `getQueryKey(api.endpoint)` — never hardcoded manual keys
- [ ] Invalidation via `invalidate()` (from `useQuery`) or `queryClient.invalidateQueries({ queryKey: getQueryKey(...) })`
- [ ] `useMutation` destructured as a tuple: `const [mutate, { isPending }]`
- [ ] Mutation arguments: `{ json: data }`, `{ param: { id } }`, `{ query: {...} }`

## Frontend — Forms

- [ ] Zod schema in `features/[feature]/schema/` — never inline in the component
- [ ] `useForm` typed with the type inferred from the schema: `useForm<MyType>`
- [ ] `zodResolver` or `standardSchemaResolver` used — never manual validation
- [ ] Multi-component forms use `FormProvider` + `useFormContext` — never a custom React Context
- [ ] Errors displayed via `<FieldError errors={[errors.field]} />` — no custom `<p>`
- [ ] Server errors via `setError('root', ...)` and displayed with `errors.root`
- [ ] `Field`, `FieldGroup`, `FieldLabel`, `FieldError` components used to structure the form

## Backend — Route Architecture

- [ ] Each route has exactly 4 files: `schema.ts`, `doc.ts`, `controller.ts`, `route.ts`
- [ ] `route.ts` contains only wiring `.openapi(route, controller)` — zero business logic
- [ ] Controllers are typed `RouteHandler<typeof myRoute, AuthenticatedContext>`
- [ ] Inputs validated via `req.valid("json")`, `req.valid("param")`, `req.valid("query")` — never `req.json()` directly
- [ ] Status codes from `stoker/http-status-codes` — never hardcoded numbers (`200`, `404`, etc.)
- [ ] Error phrases from `stoker/http-status-phrases` if needed

## Backend — Auth

- [ ] Protected routes use `middleware: [requireAuth]` or `middleware: [requireRoles([ROLES.xxx])]`
- [ ] Protected routes use `createAuthResponses({...})` — no manual 401/403 in responses
- [ ] `security: [{ bearerAuth: [] }]` present on protected routes in `doc.ts`
- [ ] User accessed via `c.var.user` or destructured as `{ var: { user } }`

---

Output format:

**If everything is correct:** "✅ Review OK — no issues found."

**If problems are found:**

```
❌ [file:line] — Description of the problem
→ Fix: what should be written instead
```

Sort problems by severity: architecture errors first, then conventions, then style.
