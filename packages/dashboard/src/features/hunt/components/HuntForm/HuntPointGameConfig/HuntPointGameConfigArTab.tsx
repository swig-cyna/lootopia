import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@lootopia/dashboard/components/ui/field"
import { Input } from "@lootopia/dashboard/components/ui/input"
import {
  arConfigSchema,
  type ArConfigValues,
  type HuntFormValues,
} from "@lootopia/dashboard/features/hunt/schema/hunt"
import { FormProvider, useForm, useFormContext } from "react-hook-form"

type HuntPointGameConfigArTabProps = {
  pointId: string | null
  onSave: () => void
}

const HuntPointGameConfigArTab = ({
  pointId,
  onSave,
}: HuntPointGameConfigArTabProps) => {
  const { getValues, setValue } = useFormContext<HuntFormValues>()

  const point = getValues("points").find((p) => p.id === pointId)
  const existing = point?.gameType === "ar" ? point : undefined

  const methods = useForm<ArConfigValues>({
    resolver: zodResolver(arConfigSchema),
    defaultValues: { arId: existing?.arId ?? "" },
  })

  const onSubmit = methods.handleSubmit((data) => {
    const points = getValues("points")
    setValue(
      "points",
      points.map((p) =>
        p.id === pointId
          ? { ...p, gameType: "ar" as const, arId: data.arId }
          : p,
      ) as HuntFormValues["points"],
    )
    onSave()
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="arId">AR Game ID</FieldLabel>
            <Input id="arId" {...methods.register("arId")} />
            <FieldError errors={[methods.formState.errors.arId]} />
          </Field>
        </FieldGroup>

        <Button type="submit">Save</Button>
      </form>
    </FormProvider>
  )
}

export default HuntPointGameConfigArTab
