---
name: code-quality
description: Code quality conventions — no prop drilling, named handlers, curry functions, early returns, no anonymous functions in JSX, no nested ifs, lookup objects over switch/if chains, grouped state, no magic strings/numbers. Use when the user asks about code readability, refactoring, or best practices.
---

# Code Quality — Conventions

## No anonymous functions in JSX

Never write inline anonymous functions in JSX event handlers.
Extract them as named functions in the component or hook.

```tsx
// ✅ Correct
const handleSubmit = () => {
  form.submit(id)
}
<button onClick={handleSubmit}>Submit</button>

// ❌ Incorrect
<button onClick={() => form.submit(id)}>Submit</button>
```

**Why:** anonymous functions are re-created on every render, make profiling harder, and clutter the JSX.

---

## Curry functions for parameterized handlers

When a handler needs a parameter (e.g. an id), use a curry function — not an inline arrow.

```tsx
// ✅ Correct
const handleDelete = (id: string) => () => {
  deleteItem(id)
}
<button onClick={handleDelete(item.id)}>Delete</button>

// ✅ Also correct for event + param
const handleChange = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
  updateItem(id, e.target.value)
}
<input onChange={handleChange(item.id)} />

// ❌ Incorrect
<button onClick={() => deleteItem(item.id)}>Delete</button>
```

---

## Lookup objects over if/else chains and switch/case

When branching on a discrete set of values (status, role, type…), use a lookup object indexed by key instead of `if/else if` or `switch/case`.

```tsx
// ✅ Correct — lookup object
const STATUS_LABEL: Record<HuntStatus, string> = {
  active: "Active",
  pending: "Pending",
  archived: "Archived",
}
const label = STATUS_LABEL[status] ?? "Unknown"

// ✅ With components
const STATUS_BADGE: Record<HuntStatus, JSX.Element> = {
  active: <Badge variant="success">Active</Badge>,
  pending: <Badge variant="warning">Pending</Badge>,
  archived: <Badge variant="muted">Archived</Badge>,
}
return STATUS_BADGE[status] ?? null

// ✅ With a Map for non-string keys
const ACTION_MAP = new Map([
  ["delete", handleDelete],
  ["archive", handleArchive],
])
const handler = ACTION_MAP.get(action)

// ❌ Incorrect — if/else if chain
if (status === "active") return "Active"
else if (status === "pending") return "Pending"
else if (status === "archived") return "Archived"
else return "Unknown"

// ❌ Incorrect — switch/case
switch (status) {
  case "active":
    return "Active"
  case "pending":
    return "Pending"
  default:
    return "Unknown"
}
```

**When to use `Map` vs plain object:**

- Plain object (`Record`) → string/symbol keys, simple value lookup
- `Map` → non-string keys, insertion-order matters, or keys are dynamic

---

## Avoid prop drilling — max 2 levels

Never pass props through more than 2 component levels.
If a value needs to go deeper, use React Context (see `frontend-architecture` skill for the pattern).

```tsx
// ✅ Correct — context for deeply shared state
const { data } = useUserAvatar()

// ❌ Incorrect — drilling through 3+ levels
<A userId={userId}>
  <B userId={userId}>
    <C userId={userId} />
  </B>
</A>
```

---

## Early return over nested ifs

Prefer early returns to reduce nesting. Never nest `if` inside `if` when a guard clause works.

```tsx
// ✅ Correct
if (!user) return null
if (!user.isActive) return <Suspended />
return <Dashboard user={user} />

// ❌ Incorrect
if (user) {
  if (user.isActive) {
    return <Dashboard user={user} />
  } else {
    return <Suspended />
  }
}
return null
```

---

## No else after return

When an `if` block always returns, the `else` branch is unnecessary.

```tsx
// ✅ Correct
if (isLoading) return <Spinner />
return <Content />

// ❌ Incorrect
if (isLoading) {
  return <Spinner />
} else {
  return <Content />
}
```

---

## IIFE for complex inline variable initialization

When a variable requires branching logic to be initialized, use an IIFE to keep it inline without declaring a separate function.

```tsx
// ✅ Correct — IIFE to compute a value inline
const label = (() => {
  if (status === "active") return "Active"
  if (status === "pending") return "Pending"
  return "Unknown"
})()

// ✅ Also valid for derived data with multiple conditions
const displayName = (() => {
  if (!user) return "Guest"
  if (user.nickname) return user.nickname
  return user.email
})()

// ❌ Incorrect — nested ternaries for the same result
const label =
  status === "active" ? "Active" : status === "pending" ? "Pending" : "Unknown"
```

> Prefer a lookup object when the branching is on a discrete set of known values. Use IIFE when the logic is more complex (multiple conditions, transformations, etc.).

---

## Limit component props

A component with more than 5 props is a signal to refactor.

- Group related props into an object
- Move logic to a hook and reduce what the component needs
- Use Context if many siblings need the same values

```tsx
// ✅ Correct — grouped
type HuntCardProps = {
  hunt: Hunt // one object instead of id + name + date + status + ...
  onDelete: () => void
}

// ❌ Incorrect — too many individual props
type HuntCardProps = {
  id: string
  name: string
  date: string
  status: string
  location: string
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}
```

---

## Group related state into objects

Never declare multiple `useState` calls for values that are always updated together.
Group them into a single state object.

```tsx
// ✅ Correct — one state object
const [form, setForm] = useState({ name: "", email: "", role: "player" })
const handleChange =
  (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

// ❌ Incorrect — scattered individual states
const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [role, setRole] = useState("player")
```

**When to keep separate states:** values that update independently and are unrelated (e.g. `isOpen` + `searchQuery`). When in doubt, group.

---

## No magic strings or numbers

Never hardcode raw string values or numbers inline in logic or JSX.
Always extract them as named constants.

**Same file use** → declare at the top of the file in `SCREAMING_SNAKE_CASE`:

```tsx
// ✅ Correct
const MAX_HUNT_POINTS = 20
const DEFAULT_ZOOM = 14
const DEBOUNCE_DELAY_MS = 300

if (points.length >= MAX_HUNT_POINTS) return
map.flyTo({ zoom: DEFAULT_ZOOM })

// ❌ Incorrect
if (points.length >= 20) return
map.flyTo({ zoom: 14 })
```

**Shared across the feature** → declare in `features/[feature]/constants.ts`:

```tsx
// features/hunt/constants.ts
export const MAX_HUNT_POINTS = 20
export const HUNT_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
  ARCHIVED: "archived",
} as const
```

**Shared across multiple features** → declare in `src/constants.ts`.

**Rules:**

- String values used in comparisons, API params, or display → always a named constant
- Numbers used as thresholds, limits, delays, sizes → always a named constant
- Exception: obvious values like `0`, `1`, `100` used as simple counters or percentages in an unambiguous context

---

## No re-export proxies for shared packages

When a constant, type, or utility moves to a shared package (e.g. `@lootopia/common`),
**do not add a re-export in the old file**. Update every consumer to import directly from the source package.

```ts
// ✅ Correct — import directly from the source
import { AR_GAMES, AR_GAME_IDS } from "@lootopia/common/constants/hunt"

// ❌ Incorrect — re-export proxy in the old file
// features/hunt/utils/constant.ts
export { AR_GAMES, AR_GAME_IDS } from "@lootopia/common/constants/hunt"

// ❌ Incorrect — consuming via the proxy
import { AR_GAMES } from "@lootopia/dashboard/features/hunt/utils/constant"
```

**Why:** re-export proxies hide the real source, create a fake dependency on the old location, and make it impossible to know at a glance where a value actually lives. When a value moves, the old file should either remove the export entirely or be deleted — never become a pass-through.

---

## Quick Reference

| Situation                           | Rule                                     |
| ----------------------------------- | ---------------------------------------- |
| Event handler in JSX                | Named function, never inline arrow       |
| Handler needs a parameter           | Curry function `(id) => () => ...`       |
| Handler needs event + parameter     | Curry `(id) => (e) => ...`               |
| Branching on discrete values        | Lookup object `Record<K, V>` or `Map`    |
| `if/else if` chain or `switch/case` | Replace with lookup object               |
| Props passed through 3+ levels      | Extract to Context                       |
| Component with 6+ props             | Group into object or extract to hook     |
| Nested `if/else`                    | Early return / guard clauses             |
| `else` after a `return`             | Remove the `else`                        |
| Complex variable initialization     | IIFE                                     |
| Multiple related `useState`         | Group into one state object              |
| Raw string/number inline in logic   | Named constant in `SCREAMING_SNAKE_CASE` |
| Constant used only in this file     | Top of file                              |
| Constant shared within a feature    | `features/[feature]/constants.ts`        |
| Constant shared across features     | `src/constants.ts`                       |
| Constant moved to a shared package  | Import directly from source, no re-export proxy |
