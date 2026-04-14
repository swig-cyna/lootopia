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
  profileSchema,
  type ProfileFormValues,
} from "@lootopia/mobile/features/account/schema/profile"
import authClient from "@lootopia/mobile/features/auth/utils/auth-client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

const ProfileForm = () => {
  const { data: session } = authClient.useSession()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: standardSchemaResolver(profileSchema),
    defaultValues: { name: "" },
  })

  useEffect(() => {
    if (session?.user.name) {
      reset({ name: session.user.name })
    }
  }, [session?.user.name])

  const onSubmit = async (data: ProfileFormValues) => {
    await authClient.updateUser(
      { name: data.name },
      {
        onError: (ctx) => {
          setError("root", { message: ctx.error.message })
        },
      },
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Profile</h2>

      <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
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

          {errors.root && <FieldError>{errors.root.message}</FieldError>}
        </FieldGroup>
      </form>

      <Button
        type="submit"
        form="profile-form"
        className="w-full"
        size="lg"
        loading={isSubmitting}
      >
        Save changes
      </Button>
    </section>
  )
}

export default ProfileForm
