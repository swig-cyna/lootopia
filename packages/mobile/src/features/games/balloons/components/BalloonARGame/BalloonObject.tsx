import { Sphere } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type { Group } from "three"
import type { Balloon } from "../../types"
import { useBalloonARGame } from "./BalloonARGame.context"

type BalloonObjectProps = {
  balloon: Balloon
}

export const BalloonObject = ({ balloon }: BalloonObjectProps) => {
  const { data } = useBalloonARGame()
  const groupRef = useRef<Group>(null)
  const phaseRef = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return
    }

    phaseRef.current += delta * 0.8
    groupRef.current.position.y =
      balloon.position[1] + Math.sin(phaseRef.current) * 0.08
  })

  if (balloon.popped) {
    return null
  }

  const radius = 0.15 * balloon.scale
  const handleClick = () => data.popBalloon(balloon.id)

  return (
    <group
      ref={groupRef}
      position={[balloon.position[0], balloon.position[1], balloon.position[2]]}
    >
      <Sphere args={[radius, 32, 32]} onClick={handleClick}>
        <meshStandardMaterial
          color={balloon.color}
          metalness={0.15}
          roughness={0.35}
          emissive={balloon.color}
          emissiveIntensity={0.15}
        />
      </Sphere>

      <mesh position={[0, -radius - 0.15, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.3, 4]} />
        <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
      </mesh>
    </group>
  )
}
