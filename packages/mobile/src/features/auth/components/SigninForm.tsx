import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Button } from "@lootopia/mobile/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@lootopia/mobile/components/ui/field"
import { Input } from "@lootopia/mobile/components/ui/input"
import {
  signinSchema,
  type SigninFormValues,
} from "@lootopia/mobile/features/auth/schema/signin"
import authClient from "@lootopia/mobile/features/auth/utils/auth-client"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"

const SigninForm = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: standardSchemaResolver(signinSchema),
  })

  const onSubmit = async (data: SigninFormValues) => {
    await authClient.signIn.email(
      { email: data.email, password: data.password },
      {
        onError: (ctx) => {
          setError("root", { message: ctx.error.message })
        },
        onSuccess: () => {
          navigate("/")
        },
      },
    )
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Sign in to your account
        </p>
      </div>

      <form id="signin-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>

          {errors.root && <FieldError>{errors.root.message}</FieldError>}
        </FieldGroup>
      </form>

      <Button
        type="submit"
        form="signin-form"
        className="w-full"
        size="lg"
        loading={isSubmitting}
      >
        Sign in
      </Button>
    </div>
  )
}

export default SigninForm
