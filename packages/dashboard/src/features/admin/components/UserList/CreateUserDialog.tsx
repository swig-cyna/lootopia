import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@lootopia/dashboard/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@lootopia/dashboard/components/ui/field"
import { Input } from "@lootopia/dashboard/components/ui/input"
import {
  RadioGroup,
  RadioGroupItem,
} from "@lootopia/dashboard/components/ui/radio-group"
import { useUserListContext } from "@lootopia/dashboard/features/admin/components/UserList/UserList.context"
import { ROLE_OPTIONS } from "@lootopia/dashboard/features/admin/constants"
import {
  createUserSchema,
  type CreateUserValues,
} from "@lootopia/dashboard/features/admin/schema/user"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

const FORM_ID = "create-user-form"

const DEFAULT_VALUES: CreateUserValues = {
  name: "",
  email: "",
  password: "",
  role: "player",
}

const CreateUserDialog = () => {
  const { data } = useUserListContext()
  const { createUser } = data

  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const onSubmit = async (values: CreateUserValues) => {
    try {
      await createUser(values)
      reset(DEFAULT_VALUES)
      setIsOpen(false)
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Failed to create user",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create user
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Create a new account and assign its role.
          </DialogDescription>
        </DialogHeader>

        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

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

            <Field>
              <FieldLabel>Role</FieldLabel>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        htmlFor={`new-role-${option.value}`}
                        className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm"
                      >
                        <RadioGroupItem
                          id={`new-role-${option.value}`}
                          value={option.value}
                        />
                        {option.label}
                      </label>
                    ))}
                  </RadioGroup>
                )}
              />
              <FieldError errors={[errors.role]} />
            </Field>

            {errors.root && <FieldError>{errors.root.message}</FieldError>}
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form={FORM_ID} loading={isSubmitting}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserDialog
