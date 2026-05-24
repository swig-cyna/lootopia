import HuntInfoPanel from "@lootopia/mobile/features/hunts/components/HuntSession/HuntInfoPanel"
import GameSheet from "@lootopia/mobile/features/hunts/components/GameSheet"
import {
  type HuntPoint,
  useHuntSession,
} from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import HuntPointsOverlay from "@lootopia/mobile/features/map/components/HuntPointsOverlay"
import { useEffect } from "react"

type HuntSessionProps = {
  huntId: string
  points: HuntPoint[]
  completedPointIds: string[]
  totalScore: number
}

const HuntSession = ({
  huntId,
  points,
  completedPointIds,
  totalScore,
}: HuntSessionProps) => {
  const { setHuntData, activePoint, validatePoint } = useHuntSession()

  useEffect(() => {
    setHuntData(points, completedPointIds, totalScore)
  }, [huntId, completedPointIds.length, totalScore])

  return (
    <>
      <HuntPointsOverlay />
      <HuntInfoPanel />
      {activePoint && (
        <GameSheet point={activePoint} onValidate={validatePoint} />
      )}
    </>
  )
}

export default HuntSession
