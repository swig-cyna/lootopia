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
  signupSchema,
  type SignupFormValues,
} from "@lootopia/common/schemas/auth"
import authClient from "@lootopia/mobile/features/auth/utils/auth-client"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"

const SignupForm = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: standardSchemaResolver(signupSchema),
  })

  const onSubmit = (data: SignupFormValues) =>
    authClient.signUp.email(
      { name: data.name, email: data.email, password: data.password },
      {
        onSuccess: () => navigate("/"),
        onError: (ctx) => setError("root", { message: ctx.error.message }),
      },
    )

  return (
    <div className="flex w-full flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Sign up to start exploring hunts
        </p>
      </div>

      <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

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
              autoComplete="new-password"
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            <FieldError errors={[errors.confirmPassword]} />
          </Field>

          {errors.root && <FieldError>{errors.root.message}</FieldError>}
        </FieldGroup>
      </form>

      <Button
        type="submit"
        form="signup-form"
        className="w-full"
        size="lg"
        loading={isSubmitting}
      >
        Create account
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link to="/signin" className="text-foreground underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default SignupForm
