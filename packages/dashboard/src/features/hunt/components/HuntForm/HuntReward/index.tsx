import { FieldError } from "@lootopia/dashboard/components/ui/field"
import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { cn } from "@lootopia/dashboard/lib/utils"
import { ChevronRight, Trophy } from "lucide-react"
import { useFormContext } from "react-hook-form"

type HuntRewardProps = {
  onConfigure: () => void
}

const HuntReward = ({ onConfigure }: HuntRewardProps) => {
  const {
    watch,
    formState: { errors },
  } = useFormContext<HuntFormValues>()

  const reward = watch("reward")
  const isConfigured = Boolean(reward?.promoCode)

  return (
    <div className="flex w-full flex-col gap-1.5">
      <button
        type="button"
        onClick={onConfigure}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
          "hover:bg-accent focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
        )}
      >
        <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
          <Trophy className="size-5" />
        </span>

        <span className="flex flex-1 flex-col">
          <span className="font-semibold">Configure rewards</span>
          <span className="text-muted-foreground text-sm">
            {isConfigured
              ? `Top ${reward.topX} • ${reward.promoCode}`
              : "Choose distribution mode and prizes"}
          </span>
        </span>

        <ChevronRight className="text-muted-foreground size-5 shrink-0" />
      </button>

      <FieldError errors={[errors.reward?.topX, errors.reward?.promoCode]} />
    </div>
  )
}

export default HuntReward
