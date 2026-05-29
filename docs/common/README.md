# Common — `@lootopia/common`

Shared constants, types, and Zod schemas used by both the API and the frontends. No runtime logic — pure definitions.

## Exports

All imports use path-based exports — there is no default `@lootopia/common` barrel:

```typescript
import { ROLES } from "@lootopia/common/constants/hunt"
import { signinSchema } from "@lootopia/common/schemas/auth"
import { quizConfigSchema } from "@lootopia/common/schemas/hunt"
```

---

## Constants (`@lootopia/common/constants/hunt`)

### Game types

```typescript
export const HUNT_GAME_TYPE = {
  QUIZ: "quiz",
  AR: "ar",
  NONE: "none",
} as const
export type HuntGameType = (typeof HUNT_GAME_TYPE)[keyof typeof HUNT_GAME_TYPE]
```

### Hunt status

```typescript
export const HUNT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const
export type HuntStatus = (typeof HUNT_STATUS)[keyof typeof HUNT_STATUS]
```

### Hunt sort

```typescript
export const HUNT_SORT = {
  RECENT: "recent",
  OLDEST: "oldest",
  TITLE: "title",
} as const
export type HuntSort = (typeof HUNT_SORT)[keyof typeof HUNT_SORT]
```

### AR games

```typescript
export const AR_GAME_IDS = ["balloons"] as const
export type ArGameId = (typeof AR_GAME_IDS)[number]

export const AR_GAMES = [
  {
    id: "balloons" as const,
    label: "Balloon Popping",
    description: "Pop as many balloons as possible before the timer runs out.",
  },
] satisfies { id: ArGameId; label: string; description: string }[]
```

### Validation limits

```typescript
export const HUNT_POINTS_MIN = 3
export const HUNT_POINTS_MAX = 5
export const HUNT_TITLE_MIN = 2
export const HUNT_TITLE_MAX = 255
export const QUIZ_ANSWERS_MIN = 2
export const MAX_AR_SCORE = 2000
export const VALIDATION_RADIUS_M = 10 // meters — proximity required to validate a point
```

---

## Schemas (`@lootopia/common/schemas/auth`)

```typescript
export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export type SigninFormValues = z.infer<typeof signinSchema>
```

---

## Schemas (`@lootopia/common/schemas/hunt`)

Reusable building blocks for hunt configuration, shared between the frontend forms and the API validation layer.

```typescript
// Base location input
export const basePointInputSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  position: z.number().int().positive(),
})

// Quiz config (used in HuntForm + API)
export const quizConfigSchema = z.object({
  question: z.string().min(1),
  answers: z.array(z.string().min(1)).min(QUIZ_ANSWERS_MIN),
  correctIndex: z.number().int().min(0),
}).refine(...)

export type QuizConfigValues = z.infer<typeof quizConfigSchema>

// AR game config
export const arConfigSchema = z.object({
  arId: z.enum(AR_GAME_IDS),
})

export type ArConfigValues = z.infer<typeof arConfigSchema>

// Reward config
export const rewardConfigSchema = z.object({
  topX: z.number().int().min(1),
  promoCode: z.string().min(1),
})

export type RewardConfigValues = z.infer<typeof rewardConfigSchema>
```

---

## Rules

- **Never add re-export proxies.** When a constant or schema moves to `@lootopia/common`, update every consumer to import directly from the source path. Do not add a re-export in the old file.
- **No runtime logic.** This package only contains constants, types, and schemas.
- **Add new constants here** when a value is used by both the API and a frontend — not in just one package.
