import { Button } from "@lootopia/mobile/components/ui/button"
import { BalloonARGame } from "@lootopia/mobile/features/games/balloons"
import { useEffect, useState } from "react"

type ARGameProps = {
  pointId: string
  onValidate: () => void
}

const ARGame = ({ pointId, onValidate }: ARGameProps) => {
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null)
  const [started, setStarted] = useState(false)

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

  const handleStart = () => setStarted(true)
  const handleClose = () => setStarted(false)

  if (started) {
    return (
      <BalloonARGame
        pointId={pointId}
        onValidate={onValidate}
        onClose={handleClose}
      />
    )
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
          AR is not supported on this device. You need a compatible Android
          device with Chrome to play this game.
        </p>
        <Button disabled className="h-auto w-full rounded-xl py-3">
          Start AR
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
