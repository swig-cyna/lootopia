---
name: forms
description: Forms — react-hook-form, Zod schemas, Field components, validation, server errors. Use when the user asks about forms, form validation, input fields, or form submission in the frontend.
---

# Forms — react-hook-form + Zod

## Setup

```typescript
import { useForm, useFormContext, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// or for Zod v4 schemas:
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
```

**Rule:** use `zodResolver` for simple Zod schemas, `standardSchemaResolver` for complex Zod v4 schemas (e.g. `huntSchema`).

---

## Complex form structure (multi-component)

For forms with sub-components, use **`FormProvider` + `useFormContext`** instead of a custom React Context. This is the native react-hook-form pattern.

### 1. Schema in `features/[feature]/schema/`

```typescript
// features/auth/schema/signin.ts
import { z } from "@hono/zod-openapi"

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type SigninFormValues = z.infer<typeof signinSchema>
```

### 2. `index.tsx` — initializes the form, wraps with `FormProvider`

```tsx
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signinSchema, type SigninFormValues } from "../schema/signin"
import { SigninFormFields } from "./SigninFormFields"

const SigninForm = () => {
  const methods = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = methods.handleSubmit(async (data) => {
    // call mutation
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <SigninFormFields />
        <Button type="submit" loading={methods.formState.isSubmitting}>
          Sign in
        </Button>
      </form>
    </FormProvider>
  )
}
```

### 3. Sub-component — consumes via `useFormContext`

```tsx
import { useFormContext } from "react-hook-form"
import { type SigninFormValues } from "../schema/signin"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export const SigninFormFields = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SigninFormValues>()

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" {...register("email")} />
        <FieldError errors={[errors.email]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input id="password" type="password" {...register("password")} />
        <FieldError errors={[errors.password]} />
      </Field>

      {errors.root && <FieldError>{errors.root.message}</FieldError>}
    </FieldGroup>
  )
}
```

**Rules:**

- `useForm` is called **only in `index.tsx`** — never in a sub-component
- `FormProvider` wraps the `<form>` and exposes the context to all descendants
- Sub-components use `useFormContext<MyType>()` to access `register`, `errors`, `setValue`, etc.
- Never create a custom React Context for forms — `FormProvider` is sufficient

---

## Simple form (single component)

When the form has no sub-components, `FormProvider` is not needed:

```tsx
const SigninForm = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
  })

  const onSubmit = async (data: SigninFormValues) => { ... }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" {...register('email')} />
          <FieldError errors={[errors.email]} />
        </Field>
      </FieldGroup>
    </form>
  )
}
```

---

## Available Field components

| Component                  | Role                                                              |
| -------------------------- | ----------------------------------------------------------------- |
| `FieldGroup`               | Container for all fields                                          |
| `Field`                    | Wrapper for a single field (label + input + error)                |
| `FieldLabel`               | Field label, linked via `htmlFor`                                 |
| `FieldError`               | Displays errors — accepts `errors={[errors.field]}` or `children` |
| `FieldDescription`         | Helper text below a field                                         |
| `FieldSet` / `FieldLegend` | For grouping fields (radio, checkbox)                             |

**`FieldError` accepts:**

- `errors={[errors.field]}` → displays the Zod error message
- `<FieldError>{errors.root.message}</FieldError>` → manual message (server errors)

---

## Server error (root error)

```typescript
const { setError } = useFormContext<SigninFormValues>()
// or from useForm in index.tsx

const onSubmit = async (data: FormValues) => {
  await authClient.signIn.email(data, {
    onError: (ctx) => {
      setError('root', { message: ctx.error.message })
    },
  })
}

// In JSX
{errors.root && <FieldError>{errors.root.message}</FieldError>}
```

---

## Form + API mutation pattern

```typescript
// In index.tsx
const methods = useForm<HuntFormValues>({ resolver: zodResolver(huntSchema) })

const [createHunt, { isPending }] = useMutation(api.hunts.$post, {
  onError: (err) => methods.setError('root', { message: err.message }),
})

const onSubmit = methods.handleSubmit((data) => createHunt({ json: data }))

return (
  <FormProvider {...methods}>
    <form onSubmit={onSubmit}>
      <HuntFormFields />
      <Button type="submit" loading={isPending}>Create</Button>
    </form>
  </FormProvider>
)
```

---

## Rules

- Always define the Zod schema in `features/[feature]/schema/` — never inline in the component
- Always type `useForm<MyType>` and `useFormContext<MyType>` with the type inferred from the schema
- Multi-component forms → `FormProvider` + `useFormContext`, never a custom React Context
- Always use `FieldError` to display errors, never a custom `<p>`
- Server errors go into `setError('root', ...)` and are displayed with `errors.root`
