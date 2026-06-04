import { Button } from "@lootopia/mobile/components/ui/button"
import { useHuntSession } from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import { api, getQueryKey, useMutation } from "@lootopia/mobile/lib/api"
import queryClient from "@lootopia/mobile/lib/queryClient"
import { Gift } from "lucide-react"

const HuntRewardPanel = () => {
  const { huntId, reward } = useHuntSession()

  const [claimReward, { isPending, isError, error }] = useMutation(
    api.hunts[":huntId"].reward.claim.$post,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getQueryKey(api.hunts.published[":huntId"], {
            param: { huntId },
          }),
        })
      },
    },
  )

  const handleClaim = () => {
    claimReward({ param: { huntId } })
  }

  if (!reward) {
    return null
  }

  if (reward.claimed) {
    return (
      <div className="rounded-xl border border-green-500/40 bg-green-500/10 p-3 text-center">
        <p className="text-sm font-medium text-green-600">Reward claimed</p>
        {reward.promoCode && (
          <p className="mt-1 font-mono text-base font-semibold tracking-wide">
            {reward.promoCode}
          </p>
        )}
      </div>
    )
  }

  if (reward.eligible) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          className="h-12 w-full"
          loading={isPending}
          onClick={handleClaim}
        >
          <Gift className="size-5" />
          Claim your reward
        </Button>
        {isError && (
          <p className="text-destructive text-center text-xs">
            {error?.message}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-muted rounded-xl p-3 text-center">
      <p className="text-muted-foreground text-xs">
        Top {reward.topX} players win a reward
      </p>
    </div>
  )
}

export default HuntRewardPanel
