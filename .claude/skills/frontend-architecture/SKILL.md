---
name: frontend-architecture
description: Frontend React architecture — feature folders, components, hooks, context pattern, naming. Use when the user asks about how to structure a React component, where to put a file, feature organization, or frontend architecture.
---

# Frontend React - Feature-Based Architecture

## General Structure

All frontend code follows a **Feature-Based Architecture** (inspired by Feature-Sliced Design).
The main rule: **code lives as close as possible to where it is used**.

```
src/
├── features/                    # everything specific to a feature
├── components/                  # generic and reusable UI components
├── hooks/                       # generic and reusable hooks
├── utils/                       # generic utilities
├── lib/                         # external library configs (axios, i18n, etc.)
├── types/                       # shared global types
└── pages/ (or routes/)          # route entry points
```

---

## Feature Structure

Each feature is a self-contained folder inside `src/features/`.
It contains everything that is **exclusively related to it**.

```
src/features/auth/
├── components/                  # components specific to the feature
├── hooks/                       # hooks specific to the feature
├── utils/                       # utilities specific to the feature
├── types.ts                     # types specific to the feature
├── constants.ts                 # constants specific to the feature
└── index.ts                     # public exports of the feature
```

---

## Rule: Simple Component vs Complex Component

### Simple component → single file

If a component is **standalone and small**, it stays a single file:

```
features/auth/components/LoginForm.tsx
features/auth/components/UserBadge.tsx
```

### Complex component → dedicated folder

If a component becomes **too large**, has **sub-components**, or needs **shared state**,
it becomes a **folder named after it**:

```
features/auth/components/UserAvatar/
├── index.tsx                    # entry point, manages state, assembles sub-components, provides context
├── UserAvatar.context.tsx       # context + provider + useUserAvatar hook
├── UserAvatarImage.tsx          # sub-component
├── UserAvatarMenu.tsx           # sub-component
└── UserAvatar.types.ts          # internal types if needed
```

**Rules for a component folder:**

- `index.tsx` is the **only file imported from outside** the folder
- `index.tsx` manages all the state and builds the `data` object passed to the context
- Sub-components consume the context via the hook exposed in `UserAvatar.context.tsx`
- Sub-components are **never imported directly** from outside the folder

---

## Component Naming Convention

- All component files and folders use **PascalCase**: `LoginForm.tsx`, `UserAvatar/`
- Sub-components of a complex component are **prefixed with the parent's name**:
  - Parent: `UserAvatar`
  - Sub-components: `UserAvatarImage.tsx`, `UserAvatarMenu.tsx`, `UserAvatarBadge.tsx`
- This makes the relationship explicit and prevents naming collisions across features
- Hooks use **camelCase** prefixed with `use`: `useUserAvatar.ts`, `useAuthSession.ts`
- Utility files use **camelCase**: `formatDate.ts`, `parseToken.ts`

---

## Component Context Pattern

The context always receives a single **`data` prop** which is an object containing
all the shared state and actions of the component. This keeps the API consistent
and predictable across all complex components.

### `UserAvatar.context.tsx`

```tsx
import { createContext, useContext } from "react"

type UserAvatarData = {
  isMenuOpen: boolean
  toggleMenu: () => void
  avatarUrl: string
  username: string
}

type UserAvatarContextType = {
  data: UserAvatarData
}

const UserAvatarContext = createContext<UserAvatarContextType | null>(null)

export const UserAvatarProvider = ({
  data,
  children,
}: {
  data: UserAvatarData
  children: React.ReactNode
}) => {
  return (
    <UserAvatarContext.Provider value={{ data }}>
      {children}
    </UserAvatarContext.Provider>
  )
}

export const useUserAvatar = () => {
  const ctx = useContext(UserAvatarContext)
  if (!ctx)
    throw new Error("useUserAvatar must be used within UserAvatarProvider")
  return ctx
}
```

### `index.tsx` — manages state, builds `data`, assembles sub-components

```tsx
import { useState } from "react"
import { UserAvatarProvider } from "./UserAvatar.context"
import { UserAvatarImage } from "./UserAvatarImage"
import { UserAvatarMenu } from "./UserAvatarMenu"

type UserAvatarProps = {
  avatarUrl: string
  username: string
}

export const UserAvatar = ({ avatarUrl, username }: UserAvatarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  return (
    <UserAvatarProvider
      data={{
        isMenuOpen,
        toggleMenu,
        avatarUrl,
        username,
      }}
    >
      <UserAvatarImage />
      <UserAvatarMenu />
    </UserAvatarProvider>
  )
}
```

### Sub-component — only reads from `data`

```tsx
import { useUserAvatar } from "./UserAvatar.context"

export const UserAvatarImage = () => {
  const { data } = useUserAvatar()

  return <img src={data.avatarUrl} alt={data.username} />
}
```

**Context rules:**

- The context holds a single `data` object, never multiple separate props
- `index.tsx` is responsible for managing state and building the `data` object
- Sub-components only **read** from `data`, they never manage state themselves
- Actions (functions) are also exposed inside `data` (e.g. `data.toggleMenu`)

---

## Rule: Feature vs Root

### Goes inside `src/features/[feature]/`

- A component used **only within that feature**
- A hook that **depends on that feature's logic**
- A utility that **manipulates that feature's data**
- Types that are **specific to that feature**

### Goes at the root (`src/`)

- A component used in **2 or more features** → `src/components/`
- A generic hook with no business logic (e.g. `useDebounce`, `useLocalStorage`) → `src/hooks/`
- A generic utility (e.g. `formatDate`, `slugify`) → `src/utils/`
- An external library config → `src/lib/`

**The question to ask yourself:**

> "Could this code exist in a completely different project without any changes?"
> Yes → root. No → inside the feature.

---

## Exports and Imports

- Each feature exposes its public elements through its `index.ts`
- Always import from the index, never deep into the folder structure

```ts
// ✅ Correct
import { LoginForm } from "@/features/auth"

// ❌ Incorrect
import { LoginForm } from "@/features/auth/components/LoginForm"
```

- The same rule applies to complex component folders:

```ts
// ✅ Correct
import { UserAvatar } from "@/features/auth/components/UserAvatar"

// ❌ Incorrect
import { UserAvatarImage } from "@/features/auth/components/UserAvatar/UserAvatarImage"
```

---

## Pages

A page is a **thin entry point** — it composes features together and handles routing concerns.
It contains **no business logic** of its own.

```
src/pages/ProfilePage.tsx
```

```tsx
// src/pages/ProfilePage.tsx
import { UserProfile } from "@/features/profile"
import { ActivityFeed } from "@/features/activity"
import { PageLayout } from "@/components/PageLayout"

// Route param comes from the router (e.g. React Router, Next.js)
type ProfilePageProps = {
  userId: string
}

export const ProfilePage = ({ userId }: ProfilePageProps) => {
  return (
    <PageLayout>
      <UserProfile userId={userId} />
      <ActivityFeed userId={userId} />
    </PageLayout>
  )
}
```

**Page rules:**

- A page only imports from `@/features/`, `@/components/`, and `@/hooks/` — never from other pages
- Data fetching triggered by route params is passed down as props to features
- A page should be readable at a glance — if it grows complex, something belongs in a feature instead

---

## Rule: Too much logic in a component → custom hook

When a component accumulates too much logic (state, effects, callbacks), extract it into a `use[ComponentName].ts` hook placed in `features/[feature]/hooks/`.

**Signals that trigger extraction:**

- 3+ `useState` or `useEffect`
- Heavy `useCallback`/`useMemo` cluttering the JSX
- Logic that is reusable or testable independently from rendering

### Structure

```
features/hunt/
├── components/
│   └── HuntForm/
│       ├── index.tsx           # JSX only — calls useHuntForm(), passes values to render
│       ├── HuntFormFields.tsx  # sub-component
│       └── HuntForm.context.tsx  # if sub-components need shared state
├── hooks/
│   └── useHuntForm.ts          # all logic: state, handlers, effects, mutations
```

### `hooks/useHuntForm.ts` — contains all the logic

```tsx
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { api, useMutation } from "@lootopia/dashboard/lib/api"

export const useHuntForm = () => {
  const [points, setPoints] = useState<HuntPoint[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HuntFormValues>({
    resolver: zodResolver(huntSchema),
  })

  const [createHunt, { isPending }] = useMutation(api.hunts.$post)

  const removePoint = useCallback((id: string) => {
    setPoints((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const onSubmit = (data: HuntFormValues) => createHunt({ json: data })

  return {
    points,
    register,
    handleSubmit,
    errors,
    isPending,
    removePoint,
    onSubmit,
  }
}
```

### `index.tsx` — JSX only

```tsx
import { useHuntForm } from "@lootopia/dashboard/features/hunt/hooks/useHuntForm"
import HuntFormFields from "./HuntFormFields"

const HuntForm = () => {
  const { register, handleSubmit, errors, isPending, onSubmit } = useHuntForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <HuntFormFields register={register} errors={errors} />
      <Button loading={isPending}>Create</Button>
    </form>
  )
}
```

**Rules:**

- The hook is named after the component prefixed with `use`: `useHuntForm`, `useUserAvatar`
- The hook always lives in `features/[feature]/hooks/` — never in the component folder
- `index.tsx` contains only JSX — zero `useState`, `useEffect`, `useCallback` directly inside
- If the component also has sub-components that share state, combine with the Context pattern: the hook provides the data, `index.tsx` passes it to the provider

---

## Quick Reference

| Situation                             | Where to put it                                       |
| ------------------------------------- | ----------------------------------------------------- |
| Simple component of a feature         | `features/[feature]/components/MyComponent.tsx`       |
| Complex component with sub-components | `features/[feature]/components/MyComponent/index.tsx` |
| Hook tied to a feature                | `features/[feature]/hooks/useMyHook.ts`               |
| Generic hook                          | `src/hooks/useMyHook.ts`                              |
| Utility tied to a feature             | `features/[feature]/utils/myFunction.ts`              |
| Generic utility                       | `src/utils/myFunction.ts`                             |
| Feature-specific types                | `features/[feature]/types.ts`                         |
| Global types                          | `src/types/`                                          |
| External library config               | `src/lib/`                                            |
| Component shared by 2+ features       | `src/components/MyComponent.tsx`                      |
| Route entry point                     | `src/pages/MyPage.tsx`                                |
