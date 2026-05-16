import { Button } from "@lootopia/mobile/components/ui/button"
import { api, useMutation } from "@lootopia/mobile/lib/api"

type ARGameProps = {
  pointId: string
  onValidate: () => void
}

const ARGame = ({ pointId, onValidate }: ARGameProps) => {
  const [validatePoint, { isPending }] = useMutation(
    api.hunts.points[":id"].validate.$post,
  )

  const handleValidate = async () => {
    await validatePoint({
      param: { id: pointId },
      json: { gameType: "ar" },
    })
    onValidate()
  }

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <p className="text-muted-foreground text-center text-sm">
        Start the AR experience to validate this point.
      </p>
      <Button
        loading={isPending}
        onClick={handleValidate}
        className="h-auto w-full rounded-xl py-3"
      >
        Start AR
      </Button>
    </div>
  )
}

export default ARGame
