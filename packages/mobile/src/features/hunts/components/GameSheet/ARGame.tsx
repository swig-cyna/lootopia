import { Button } from "@lootopia/mobile/components/ui/button"
import { api, useMutation } from "@lootopia/mobile/lib/api"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

type ARGameProps = {
  pointId: string
  onValidate: (_score: number) => void
}

const ARGame = ({ pointId, onValidate }: ARGameProps) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null)
  const [validatePoint, { isPending }] = useMutation(
    api.hunts.points[":id"].validate.$post,
  )

  useEffect(() => {
    if (!("xr" in navigator)) {
      setIsARSupported(false)

      return
    }

    navigator.xr
      ?.isSessionSupported("immersive-ar")
      .then(setIsARSupported)
      .catch(() => setIsARSupported(false))
  }, [])

  const handleStart = () => navigate(`/hunts/${id}/ar/${pointId}`)

  const handleSkip = async () => {
    await validatePoint({
      param: { id: pointId },
      json: { gameType: "ar", score: 0 },
    })
    onValidate(0)
  }

  if (isARSupported === null) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <p className="text-muted-foreground text-center text-sm">
          Checking AR support...
        </p>
      </div>
    )
  }

  if (!isARSupported) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <p className="text-muted-foreground text-center text-sm">
          AR is not supported on this device. If possible, use a compatible
          Android device with Chrome to earn points. Otherwise, you can skip
          this point with a score of 0.
        </p>
        <Button
          loading={isPending}
          onClick={handleSkip}
          className="h-auto w-full rounded-xl py-3"
        >
          Skip (score: 0)
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <p className="text-muted-foreground text-center text-sm">
        Start the AR experience to validate this point.
      </p>
      <Button onClick={handleStart} className="h-auto w-full rounded-xl py-3">
        Start AR
      </Button>
    </div>
  )
}

export default ARGame
