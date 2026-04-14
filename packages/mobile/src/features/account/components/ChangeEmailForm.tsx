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
  changeEmailSchema,
  type ChangeEmailFormValues,
} from "@lootopia/mobile/features/account/schema/change-email"
import authClient from "@lootopia/mobile/features/auth/utils/auth-client"
import { useForm } from "react-hook-form"

const ChangeEmailForm = () => {
  const { data: session } = authClient.useSession()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailFormValues>({
    resolver: standardSchemaResolver(changeEmailSchema),
    defaultValues: { newEmail: "" },
  })

  const onSubmit = async (data: ChangeEmailFormValues) => {
    await authClient.changeEmail(
      { newEmail: data.newEmail },
      {
        onError: (ctx) => {
          setError("root", { message: ctx.error.message })
        },
      },
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Change email</h2>
        <p className="text-muted-foreground text-sm">
          Current: {session?.user.email}
        </p>
      </div>

      <form id="email-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="newEmail">New email</FieldLabel>
            <Input
              id="newEmail"
              type="email"
              autoComplete="email"
              {...register("newEmail")}
            />
            <FieldError errors={[errors.newEmail]} />
          </Field>

          {errors.root && <FieldError>{errors.root.message}</FieldError>}
        </FieldGroup>
      </form>

      <Button
        type="submit"
        form="email-form"
        className="w-full"
        size="lg"
        loading={isSubmitting}
      >
        Change email
      </Button>
    </section>
  )
}

export default ChangeEmailForm
