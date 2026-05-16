import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@lootopia/dashboard/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@lootopia/dashboard/components/ui/field"
import { Input } from "@lootopia/dashboard/components/ui/input"
import {
  signinSchema,
  type SigninFormValues,
} from "@lootopia/dashboard/features/auth/schema/signin"
import authClient from "@lootopia/dashboard/features/auth/utils/auth-client"
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
    resolver: zodResolver(signinSchema),
  })

  const onSubmit = async (data: SigninFormValues) => {
    await authClient.signIn.email(
      { email: data.email, password: data.password },
      {
        onError: (ctx) => {
          setError("root", { message: ctx.error.message })
        },
        onSuccess: async () => {
          await authClient.getSession()
          navigate("/")
        },
      },
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>

      <CardContent>
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
      </CardContent>

      <CardFooter>
        <Button
          type="submit"
          form="signin-form"
          className="w-full"
          loading={isSubmitting}
        >
          Sign in
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SigninForm
