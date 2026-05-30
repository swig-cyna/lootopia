import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@lootopia/dashboard/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@lootopia/dashboard/components/ui/field"
import { Input } from "@lootopia/dashboard/components/ui/input"
import {
  rewardConfigSchema,
  type RewardConfigValues,
} from "@lootopia/common/schemas/hunt"
import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { useForm, useFormContext } from "react-hook-form"

const DEFAULT_TOP_X = 1

type HuntRewardConfigProps = {
  open: boolean
  onClose: () => void
}

const HuntRewardConfig = ({ open, onClose }: HuntRewardConfigProps) => {
  const { getValues, setValue } = useFormContext<HuntFormValues>()

  const existing = getValues("reward")

  const methods = useForm<RewardConfigValues>({
    resolver: zodResolver(rewardConfigSchema),
    defaultValues: existing ?? { topX: DEFAULT_TOP_X, promoCode: "" },
  })

  const onSubmit = methods.handleSubmit((data) => {
    setValue("reward", data, { shouldValidate: true })
    onClose()
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure rewards</DialogTitle>
          <DialogDescription>
            Choose distribution mode and prizes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="topX">Number of winners</FieldLabel>
              <Input
                id="topX"
                type="number"
                min={DEFAULT_TOP_X}
                {...methods.register("topX", { valueAsNumber: true })}
              />
              <FieldDescription>
                The top X players to finish the hunt win the prize.
              </FieldDescription>
              <FieldError errors={[methods.formState.errors.topX]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="promoCode">Promo code</FieldLabel>
              <Input id="promoCode" {...methods.register("promoCode")} />
              <FieldError errors={[methods.formState.errors.promoCode]} />
            </Field>
          </FieldGroup>

          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default HuntRewardConfig
