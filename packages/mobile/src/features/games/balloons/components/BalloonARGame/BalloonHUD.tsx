import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Vector3, type Group } from "three"
import { useBalloonARGame } from "./BalloonARGame.context"

const CAMERA_DISTANCE = 1.2
const CAMERA_OFFSET_Y = -0.35

const COUNTDOWN_COLOR: Record<number, string> = {
  3: "#f87171",
  2: "#fbbf24",
  1: "#4ade80",
  0: "#60a5fa",
}

export const BalloonHUD = () => {
  const { data } = useBalloonARGame()
  const hudGroupRef = useRef<Group>(null)
  const countdownGroupRef = useRef<Group>(null)
  const hudVec = useRef(new Vector3())
  const countdownVec = useRef(new Vector3())

  useFrame(({ camera }) => {
    if (hudGroupRef.current) {
      hudVec.current
        .set(0, CAMERA_OFFSET_Y, -CAMERA_DISTANCE)
        .applyQuaternion(camera.quaternion)
        .add(camera.position)
      hudGroupRef.current.position.copy(hudVec.current)
      hudGroupRef.current.quaternion.copy(camera.quaternion)
    }

    if (countdownGroupRef.current) {
      countdownVec.current
        .set(0, 0, -CAMERA_DISTANCE)
        .applyQuaternion(camera.quaternion)
        .add(camera.position)
      countdownGroupRef.current.position.copy(countdownVec.current)
      countdownGroupRef.current.quaternion.copy(camera.quaternion)
    }
  })

  if (data.countdown !== null) {
    const label = data.countdown === 0 ? "Go!" : `${data.countdown}`
    const color = COUNTDOWN_COLOR[data.countdown] ?? "white"

    return (
      <group ref={countdownGroupRef}>
        <Text
          fontSize={0.28}
          color={color}
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {label}
        </Text>
      </group>
    )
  }

  if (data.finished) {
    return (
      <group ref={hudGroupRef}>
        <Text
          fontSize={0.07}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.006}
          outlineColor="#000000"
        >
          {data.remaining === 0 ? "All balloons popped!" : "Time's up!"}
        </Text>
        <Text
          position={[0, -0.1, 0]}
          fontSize={0.12}
          color="#4ade80"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {`${data.score} pts`}
        </Text>
        <mesh position={[0, -0.24, 0]} onClick={data.onConfirmExit}>
          <planeGeometry args={[0.32, 0.09]} />
          <meshBasicMaterial
            color={data.isPending ? "#6b7280" : "#4ade80"}
            transparent
            opacity={0.9}
          />
        </mesh>
        <Text
          position={[0, -0.24, 0.001]}
          fontSize={0.045}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          {data.isPending ? "Saving..." : "Continue"}
        </Text>
      </group>
    )
  }

  return (
    <group ref={hudGroupRef}>
      <Text
        position={[-0.25, 0, 0]}
        fontSize={0.055}
        color="white"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        outlineWidth={0.004}
        outlineColor="#000000"
      >
        {`Score\n${data.score}`}
      </Text>
      <Text
        position={[0, 0, 0]}
        fontSize={0.055}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        outlineWidth={0.004}
        outlineColor="#000000"
      >
        {`Time\n${data.timeLeft}s`}
      </Text>
      <Text
        position={[0.25, 0, 0]}
        fontSize={0.055}
        color="white"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        outlineWidth={0.004}
        outlineColor="#000000"
      >
        {`Left\n${data.remaining}`}
      </Text>
    </group>
  )
}
