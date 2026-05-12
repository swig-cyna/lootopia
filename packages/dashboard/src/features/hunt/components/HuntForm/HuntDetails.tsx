import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@lootopia/dashboard/components/ui/field"
import { Input } from "@lootopia/dashboard/components/ui/input"
import { Textarea } from "@lootopia/dashboard/components/ui/textarea"
import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { useFormContext } from "react-hook-form"

const HuntDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HuntFormValues>()

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input id="title" {...register("title")} />
        <FieldError errors={[errors.title]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea id="description" {...register("description")} />
        <FieldError errors={[errors.description]} />
      </Field>
    </FieldGroup>
  )
}

export default HuntDetails
