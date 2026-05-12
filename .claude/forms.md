# Forms — react-hook-form + Zod

## Setup

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// ou pour les schemas Zod v4 :
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
```

**Règle :** utilise `zodResolver` pour les schemas Zod simples, `standardSchemaResolver` pour les schemas Zod v4 complexes (comme `huntSchema`).

---

## Structure d'un formulaire

### 1. Schema dans `features/[feature]/schema/`

```typescript
// features/auth/schema/signin.ts
import { z } from '@hono/zod-openapi'

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type SigninFormValues = z.infer<typeof signinSchema>
```

### 2. Hook useForm

```typescript
const {
  register,
  handleSubmit,
  setValue,
  setError,
  formState: { errors, isSubmitting },
} = useForm<SigninFormValues>({
  resolver: zodResolver(signinSchema),
  defaultValues: { email: '', password: '' },
})
```

### 3. JSX avec les composants Field

```tsx
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@lootopia/dashboard/components/ui/field'
import { Input } from '@lootopia/dashboard/components/ui/input'

<form onSubmit={handleSubmit(onSubmit)}>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" {...register('email')} />
      <FieldError errors={[errors.email]} />
    </Field>

    <Field>
      <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
      <Input id="password" type="password" {...register('password')} />
      <FieldError errors={[errors.password]} />
    </Field>

    {errors.root && <FieldError>{errors.root.message}</FieldError>}
  </FieldGroup>
</form>
```

---

## Composants Field disponibles

| Composant | Rôle |
|---|---|
| `FieldGroup` | Conteneur de l'ensemble des champs |
| `Field` | Wrapper d'un champ (label + input + erreur) |
| `FieldLabel` | Label du champ, lié via `htmlFor` |
| `FieldError` | Affiche les erreurs — accepte `errors={[errors.monChamp]}` ou `children` |
| `FieldDescription` | Texte d'aide sous un champ |
| `FieldSet` / `FieldLegend` | Pour grouper des champs (radio, checkbox) |

**`FieldError` accepte :**
- `errors={[errors.champ]}` → affiche le message d'erreur Zod
- `<FieldError>{errors.root.message}</FieldError>` → message manuel (erreurs serveur)

---

## Erreur serveur (root error)

```typescript
const onSubmit = async (data: FormValues) => {
  await authClient.signIn.email(data, {
    onError: (ctx) => {
      setError('root', { message: ctx.error.message })
    },
  })
}

// Dans le JSX
{errors.root && <FieldError>{errors.root.message}</FieldError>}
```

---

## Pattern form + mutation API

```typescript
const [createHunt] = useMutation(api.hunts.$post, {
  onError: (err) => setError('root', { message: err.message }),
})

const onSubmit = (data: HuntFormValues) => createHunt({ json: data })

<form onSubmit={handleSubmit(onSubmit)}>
  ...
  <Button type="submit" loading={isPending}>Créer</Button>
</form>
```

---

## Règles

- Toujours définir le schema Zod dans `features/[feature]/schema/` — jamais inline
- Toujours typer `useForm<MonType>` avec le type inféré du schema
- Toujours utiliser `FieldError` pour afficher les erreurs, jamais de `<p>` custom
- Les erreurs serveur vont dans `setError('root', ...)` et s'affichent avec `errors.root`
