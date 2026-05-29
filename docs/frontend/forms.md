# Forms

Uses `react-hook-form` + `zodResolver`. Schemas live in `features/[feature]/schema/`.

## Simple Form (single component)

For forms that live in a single component:

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  signinSchema,
  type SigninFormValues,
} from "@lootopia/common/schemas/auth"

const SigninForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
  })

  const onSubmit = (data: SigninFormValues) =>
    authClient.signIn.email(data, {
      onError: (ctx) => setError("root", { message: ctx.error.message }),
    })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" {...register("email")} />
          <FieldError errors={[errors.email]} />
        </Field>

        {errors.root && <FieldError>{errors.root.message}</FieldError>}
      </FieldGroup>

      <Button type="submit" loading={isSubmitting}>
        Sign in
      </Button>
    </form>
  )
}
```

## Multi-Component Form (`FormProvider` + `useFormContext`)

When a form spans multiple sub-components, use `FormProvider` so each sub-component can access form state without prop drilling:

```tsx
// HuntForm/index.tsx — manages the form, wraps with FormProvider
import { FormProvider, useForm } from "react-hook-form"

const HuntForm = ({ defaultValues, onSubmit, isPending }) => {
  const methods = useForm<HuntFormValues>({
    resolver: zodResolver(huntSchema),
    defaultValues: defaultValues ?? EMPTY_DEFAULTS,
  })

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch (err) {
      methods.setError("root", { message: err.message })
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <HuntDetails /> {/* reads form state via useFormContext */}
        <HuntPointsList />
        {methods.formState.errors.root && (
          <FieldError>{methods.formState.errors.root.message}</FieldError>
        )}
        <Button type="submit" loading={isPending}>
          Save
        </Button>
      </form>
    </FormProvider>
  )
}
```

```tsx
// HuntDetails.tsx — sub-component, reads from context
import { useFormContext } from "react-hook-form"
import type { HuntFormValues } from "../schema/hunt"

const HuntDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HuntFormValues>()

  return (
    <Field>
      <FieldLabel htmlFor="title">Title</FieldLabel>
      <Input id="title" {...register("title")} />
      <FieldError errors={[errors.title]} />
    </Field>
  )
}
```

## Field Components

Available in `components/ui/field`:

| Component            | Purpose                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| `<FieldGroup>`       | Container that spaces fields vertically                                 |
| `<Field>`            | Wraps a label + input + error in a vertical stack                       |
| `<FieldLabel>`       | `<label>` linked via `htmlFor`                                          |
| `<FieldError>`       | Shows validation errors — accepts `errors={[errors.field]}` or children |
| `<FieldDescription>` | Helper text below an input                                              |
| `<FieldSet>`         | Groups related inputs (radio, checkbox)                                 |
| `<FieldLegend>`      | Label for a `<FieldSet>`                                                |

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="name">Name</FieldLabel>
    <Input id="name" {...register("name")} />
    <FieldError errors={[errors.name]} />
    <FieldDescription>Your display name</FieldDescription>
  </Field>

  {/* Root-level errors (server errors, etc.) */}
  {errors.root && <FieldError>{errors.root.message}</FieldError>}
</FieldGroup>
```

## Schemas

Schemas live in `features/[feature]/schema/`. Always infer the form type from the schema:

```typescript
// features/auth/schema/signin.ts
import { z } from "zod"

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type SigninFormValues = z.infer<typeof signinSchema>
```

Shared schemas (used by both API and frontend) go in `@lootopia/common/schemas/`.
