import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useXR } from "@react-three/xr"
import { useRef } from "react"
import { Vector3, type Group } from "three"
import { useBalloonARGame } from "./BalloonARGame.context"
import { BalloonHUD } from "./BalloonHUD"
import { BalloonObject } from "./BalloonObject"

const CAMERA_DISTANCE = 1.2
const STABLE_FRAMES_BEFORE_START = 15

const BalloonLoadingText = () => {
  const groupRef = useRef<Group>(null)
  const vecRef = useRef(new Vector3())

  useFrame(({ camera }) => {
    if (!groupRef.current) {
      return
    }

    vecRef.current
      .set(0, 0, -CAMERA_DISTANCE)
      .applyQuaternion(camera.quaternion)
      .add(camera.position)
    groupRef.current.position.copy(vecRef.current)
    groupRef.current.quaternion.copy(camera.quaternion)
  })

  return (
    <group ref={groupRef}>
      <Text
        fontSize={0.065}
        color="white"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        {"Get ready..."}
      </Text>
    </group>
  )
}

export const BalloonScene = () => {
  const { data } = useBalloonARGame()
  const isPresenting = useXR((state) => state.session !== null)
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

  const isActive = data.started || data.countdown !== null || data.finished

  return (
    <>
      {!isActive && !isPresenting && (
        <Text visible={false} fontSize={0.01}>
          {"0123456789 Get ready... Go! All balloons popped! Time's up!"}
        </Text>
      )}

      {!isActive && isPresenting && <BalloonLoadingText />}

      {isActive && (
        <>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[-5, 5, -5]} intensity={0.5} />

          <BalloonHUD />

          {data.started &&
            data.balloons.map((balloon) => (
              <BalloonObject key={balloon.id} balloon={balloon} />
            ))}
        </>
      )}
    </>
  )
}
