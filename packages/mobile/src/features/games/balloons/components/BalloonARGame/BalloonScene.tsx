import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { useBalloonARGame } from "./BalloonARGame.context"
import { BalloonObject } from "./BalloonObject"

const STABLE_FRAMES_BEFORE_START = 15

export const BalloonScene = () => {
  const { data } = useBalloonARGame()
  const stableFramesRef = useRef(0)
  const gameStartedRef = useRef(false)

  useFrame(({ gl }, _delta, xrFrame) => {
    if (
      !gl.xr.isPresenting ||
      gameStartedRef.current ||
      data.countdown !== null ||
      data.started ||
      data.finished
    ) {
      return
    }

    const referenceSpace = gl.xr.getReferenceSpace()
    const pose =
      referenceSpace && xrFrame ? xrFrame.getViewerPose(referenceSpace) : null

    if (!pose) {
      stableFramesRef.current = 0

      return
    }

    stableFramesRef.current += 1

    if (stableFramesRef.current >= STABLE_FRAMES_BEFORE_START) {
      gameStartedRef.current = true
      data.startGame()
    }
  })

  if (!data.started) {
    return null
  }

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />

      {data.balloons.map((balloon) => (
        <BalloonObject key={balloon.id} balloon={balloon} />
      ))}
    </>
  )
}
