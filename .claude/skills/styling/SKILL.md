---
name: styling
description: Styling conventions — Tailwind, shadcn/ui, Lucide icons, theme tokens, border radius. Use when the user asks about CSS, styling, UI components, icons, colors, or design.
---

# Frontend Styling — Tailwind, shadcn/ui & Lucide Icons

## Core Rule

**Always use Tailwind CSS utility classes for styling.**
Never write custom CSS or SCSS files — the only exception is `index.css` which holds the shadcn/ui custom theme (CSS variables). Do not touch this file unless explicitly asked to modify the theme.

---

## Tailwind

- All styling is done via Tailwind utility classes directly on JSX elements
- No `className` strings built from custom CSS modules, no `styled-components`, no inline `style={{}}` unless absolutely unavoidable (e.g. dynamic values not expressible in Tailwind)
- Use Tailwind's design tokens (spacing, colors, radii, shadows) — never hardcode raw values like `text-[13px]` or `bg-[#f4f4f4]` unless the design explicitly requires a one-off value

```tsx
// ✅ Correct
<div className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-sm">

// ❌ Incorrect
<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
```

---

## Conditional ClassNames

Always use `cn` (from `@/lib/utils`) or `clsx` for any `className` that involves conditions or dynamic values. Never use string concatenation.

`cn` is already available in every shadcn/ui project via `@/lib/utils` — prefer it over importing `clsx` directly.

```tsx
import { cn } from '@/lib/utils'

// ✅ Correct — cn for conditional classes
<div className={cn('rounded-lg border bg-card p-4', isActive && 'border-primary', className)}>

// ❌ Incorrect — string concatenation
<div className={'rounded-lg border bg-card p-4' + (isActive ? ' border-primary' : '')}>

// ❌ Incorrect — template literal
<div className={`rounded-lg border bg-card p-4 ${isActive ? 'border-primary' : ''}`}>
```

If a component accepts a `className` prop, always merge it via `cn` so consumers can extend styles:

```tsx
export const StatCard = ({ className, ...props }: StatCardProps) => {
  return (
    <div
      className={cn("border-border bg-card rounded-lg border p-4", className)}
    >
      ...
    </div>
  )
}
```

---

## shadcn/ui

### Using existing components

Always prefer a shadcn/ui component over building one from scratch.
Check the shadcn/ui component list before creating anything custom.

Examples: `Button`, `Input`, `Dialog`, `Select`, `Tabs`, `Card`, `Badge`, `Tooltip`, etc.

### Installing a component

The project uses **pnpm with a monorepo workspace**. Use the official shadcn monorepo pattern with `pnpm dlx` and the `-c` flag, **from the monorepo root**:

```bash
# Dashboard (organizers frontend)
pnpm dlx shadcn@latest add <component> -c packages/dashboard

# Mobile (players frontend)
pnpm dlx shadcn@latest add <component> -c packages/mobile
```

Examples:

```bash
pnpm dlx shadcn@latest add dialog -c packages/dashboard
pnpm dlx shadcn@latest add sheet -c packages/mobile
```

> **Never** run from inside a package directory (e.g. `cd packages/dashboard && npx shadcn add ...`). The `components.json` aliases contain `@lootopia/dashboard/...` paths — when the CLI runs from inside the package, it doubles the path and creates a nested folder (`packages/dashboard/packages/dashboard/...`).

### Theme

The app uses a **custom shadcn/ui theme** defined via CSS variables in `index.css`.
All shadcn/ui semantic tokens (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border`, `ring`, etc.) are already configured.

- Always use these semantic tokens instead of raw Tailwind color classes
- Never override or redefine CSS variables outside of `index.css`

```tsx
// ✅ Correct — uses semantic theme tokens
<div className="bg-card text-card-foreground border border-border rounded-lg">

// ❌ Incorrect — hardcodes raw colors
<div className="bg-white text-gray-900 border border-gray-200 rounded-lg">
```

---

## Border Radius

**Before using any `rounded-*` class, read the `--radius` value defined in `index.css`** and use only the scale derived from it.

shadcn/ui generates the following Tailwind utilities from the theme's `--radius` variable:

- `rounded-sm` → `calc(var(--radius) - 4px)`
- `rounded-md` → `calc(var(--radius) - 2px)`
- `rounded-lg` → `var(--radius)` ← the base radius of the theme
- `rounded-xl` → `calc(var(--radius) + 4px)`

**Rules:**

- Never exceed what the theme naturally produces — avoid `rounded-2xl`, `rounded-3xl`, `rounded-full` on containers or cards
- `rounded-full` is only acceptable for avatars, icon buttons, or pill badges
- Avoid stacking oversized radii that make the UI look bubbly or toy-like — the design should feel sharp and professional
- When in doubt, prefer `rounded-md` or `rounded-lg` (the base) over anything larger

```tsx
// ✅ Correct — stays within the theme's radius scale
<div className="rounded-lg border border-border bg-card p-4">
<button className="rounded-md bg-primary px-4 py-2">
<span className="rounded-full bg-muted px-2 py-0.5 text-xs">Badge</span>

// ❌ Incorrect — oversized, breaks visual consistency
<div className="rounded-3xl border border-border bg-card p-4">
<button className="rounded-2xl bg-primary px-4 py-2">
```

---

## Custom Components

When a shadcn/ui component doesn't exist for the use case, build a custom component that:

- Uses only Tailwind classes for styling
- Follows the visual language of the existing shadcn/ui theme (same radii, spacing rhythm, color tokens, shadow levels)
- Uses the same semantic CSS variables (`bg-muted`, `text-muted-foreground`, `border-border`, etc.) so it naturally adapts to theme changes
- Feels native alongside the existing shadcn/ui components — a custom component should be indistinguishable from a shadcn one in terms of style consistency

```tsx
// Example of a custom component that respects the theme
export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-card-foreground text-2xl font-semibold">{value}</p>
    </div>
  )
}
```

---

## Lucide Icons

The project uses **`lucide-react`** as the sole icon library.
Never import icons from other libraries (`react-icons`, `heroicons`, `phosphor`, etc.).

```tsx
import { Settings, ChevronRight, AlertCircle } from 'lucide-react'

// Usage — size and color are free, use what fits the context
<Settings className="size-4 text-muted-foreground" />
<ChevronRight className="size-5" />
```

---

## Quick Reference

| Situation                     | Rule                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| Styling a component           | Tailwind classes only                                                                       |
| Custom CSS needed             | Only in `index.css` for theme variables                                                     |
| Need a UI component           | Check shadcn/ui first                                                                       |
| Installing a shadcn component | `pnpm dlx shadcn@latest add <component> -c packages/dashboard` (always from monorepo root) |
| Building a custom component   | Match shadcn/ui visual language, use theme tokens                                           |
| Need an icon                  | `lucide-react` only                                                                         |
| Conditional classNames        | Use `cn` from `@/lib/utils`, never string concat or template literals                       |
| Raw color values              | Use semantic tokens (`bg-primary`, `text-muted-foreground`, etc.)                           |
| Border radius                 | Read `--radius` in `index.css`, stay within `rounded-sm` → `rounded-xl`                     |
| Oversized radii               | Never use `rounded-2xl`, `rounded-3xl` on cards or containers                               |
| `rounded-full`                | Only for avatars, icon buttons, pill badges                                                 |
