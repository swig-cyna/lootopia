import { Button } from "@lootopia/dashboard/components/ui/button"
import { Card, CardContent } from "@lootopia/dashboard/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@lootopia/dashboard/components/ui/field"
import { Input } from "@lootopia/dashboard/components/ui/input"
import { Textarea } from "@lootopia/dashboard/components/ui/textarea"
import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { type ComponentProps } from "react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"

interface HuntFormFieldsProps {
  register: UseFormRegister<HuntFormValues>
  errors: FieldErrors<HuntFormValues>
  onSubmit: ComponentProps<"form">["onSubmit"]
}

const HuntFormFields = ({
  register,
  errors,
  onSubmit,
}: HuntFormFieldsProps) => (
  <form id="hunt-form" onSubmit={onSubmit}>
    <Card>
      <CardContent className="pt-0">
        <FieldGroup className="flex-row gap-4">
          <Field className="flex-1">
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              type="text"
              placeholder="My treasure hunt..."
              {...register("title")}
            />
            <FieldError errors={[errors.title]} />
          </Field>

          <Field className="flex-2">
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              placeholder="Describe your hunt..."
              className="min-h-9.5 resize-none"
              rows={1}
              {...register("description")}
            />
            <FieldError errors={[errors.description]} />
          </Field>

          <div className="flex items-end">
            <Button type="submit" form="hunt-form">
              Create Hunt
            </Button>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  </form>
)

export default HuntFormFields
