import { zodResolver } from "@hookform/resolvers/zod"
import { AR_GAMES, HUNT_GAME_TYPE } from "@lootopia/common/constants/hunt"
import {
  arConfigSchema,
  type ArConfigValues,
} from "@lootopia/common/schemas/hunt"
import { Button } from "@lootopia/dashboard/components/ui/button"
import { FieldError } from "@lootopia/dashboard/components/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@lootopia/dashboard/components/ui/radio-group"
import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { cn } from "@lootopia/dashboard/lib/utils"
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form"

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
  const existing = point?.game?.type === "ar" ? point.game : undefined

  const methods = useForm<ArConfigValues>({
    resolver: zodResolver(arConfigSchema),
    defaultValues: { arId: existing?.arId },
  })

  const onSubmit = methods.handleSubmit((data) => {
    const points = getValues("points")
    setValue(
      "points",
      points.map((p) =>
        p.id === pointId
          ? { ...p, game: { type: HUNT_GAME_TYPE.AR, arId: data.arId } }
          : p,
      ) as HuntFormValues["points"],
    )
    onSave()
  })

  const selectedArId = methods.watch("arId")

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Controller
          control={methods.control}
          name="arId"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-col gap-2"
            >
              {AR_GAMES.map((game) => (
                <label
                  key={game.id}
                  htmlFor={game.id}
                  className={cn(
                    "border-input flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                    selectedArId === game.id && "border-primary bg-primary/5",
                  )}
                >
                  <RadioGroupItem
                    value={game.id}
                    id={game.id}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">{game.label}</p>
                    <p className="text-muted-foreground text-xs">
                      {game.description}
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          )}
        />
        <FieldError errors={[methods.formState.errors.arId]} />

        <Button type="submit">Save</Button>
      </form>
    </FormProvider>
  )
}

export default HuntPointGameConfigArTab
