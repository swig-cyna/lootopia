import { HUNT_GAME_TYPE } from "@lootopia/common/constants/hunt"
import { Button } from "@lootopia/mobile/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@lootopia/mobile/components/ui/empty"
import { BalloonARGameProvider } from "@lootopia/mobile/features/games/balloons/components/BalloonARGame/BalloonARGame.context"
import { BalloonHTMLHUD } from "@lootopia/mobile/features/games/balloons/components/BalloonARGame/BalloonHTMLHUD"
import { BalloonScene } from "@lootopia/mobile/features/games/balloons/components/BalloonARGame/BalloonScene"
import { useBalloonGame } from "@lootopia/mobile/features/games/balloons/hooks/useBalloonGame"
import { api, useMutation } from "@lootopia/mobile/lib/api"
import { Canvas } from "@react-three/fiber"
import { XR, createXRStore } from "@react-three/xr"
import { ArrowLeft, Target } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { createPortal } from "react-dom"

const xrStore = createXRStore()

type BalloonARGameProps = {
  pointId: string
  onValidate: () => void
  onClose: () => void
}

const BalloonARGame = ({
  pointId,
  onValidate,
  onClose,
}: BalloonARGameProps) => {
  const [isLaunching, setIsLaunching] = useState(false)
  const [arPlaying, setArPlaying] = useState(false)
  const submittedRef = useRef(false)

  const gameState = useBalloonGame()
  const [validatePoint, { isPending }] = useMutation(
    api.hunts.points[":id"].validate.$post,
  )

  const handleConfirmExit = useCallback(async () => {
    if (submittedRef.current) {
      return
    }

    submittedRef.current = true

    const { session } = xrStore.getState()

    try {
      await session?.end()
    } catch {
      // Session may already be closed
    }

    try {
      await validatePoint({
        param: { id: pointId },
        json: { gameType: HUNT_GAME_TYPE.AR, score: gameState.score },
      })
      onValidate()
    } catch (error) {
      submittedRef.current = false
      console.error("Failed to validate point:", error)
    }
  }, [gameState.score, onValidate, pointId, validatePoint])

  const handleEnterAR = async () => {
    setIsLaunching(true)

    try {
      await xrStore.enterAR()
      setArPlaying(true)
    } catch {
      // AR session failed to start
    } finally {
      setIsLaunching(false)
    }
  }

  const { domOverlayRoot } = xrStore.getState()

  return (
    <BalloonARGameProvider
      data={{
        ...gameState,
        isPending,
        onConfirmExit: handleConfirmExit,
      }}
    >
      <div className="fixed inset-0 z-50 bg-black">
        <Canvas camera={{ position: [0, 1.6, 0], fov: 75 }}>
          <XR store={xrStore}>
            <BalloonScene />
          </XR>
        </Canvas>

        {!arPlaying && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <Empty className="bg-background w-full max-w-sm rounded-2xl p-6 shadow-lg">
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground -mx-1 mb-1 flex items-center gap-1 self-start text-sm"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
              <EmptyHeader>
                <EmptyMedia>
                  <Target className="text-primary size-10" />
                </EmptyMedia>
                <EmptyTitle>Balloon Popping</EmptyTitle>
                <EmptyDescription>
                  Pop as many balloons as you can before the timer runs out. The
                  faster you pop them, the higher your score!
                </EmptyDescription>
              </EmptyHeader>
              <Button
                loading={isLaunching}
                onClick={handleEnterAR}
                className="h-auto w-full rounded-xl py-3"
              >
                Start AR
              </Button>
            </Empty>
          </div>
        )}
      </div>

      {arPlaying &&
        domOverlayRoot &&
        createPortal(<BalloonHTMLHUD />, domOverlayRoot)}
    </BalloonARGameProvider>
  )
}

export default BalloonARGame
