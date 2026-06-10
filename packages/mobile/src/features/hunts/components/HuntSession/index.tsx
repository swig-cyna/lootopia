import HuntInfoPanel from "@lootopia/mobile/features/hunts/components/HuntSession/HuntInfoPanel"
import GameSheet from "@lootopia/mobile/features/hunts/components/GameSheet"
import {
  type HuntPoint,
  type HuntReward,
  useHuntSession,
} from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import HuntPointsOverlay from "@lootopia/mobile/features/map/components/HuntPointsOverlay"
import { useEffect } from "react"

type HuntSessionProps = {
  huntId: string
  points: HuntPoint[]
  completedPointIds: string[]
  totalScore: number
  reward: HuntReward
}

const HuntSession = ({
  huntId,
  points,
  completedPointIds,
  totalScore,
  reward,
}: HuntSessionProps) => {
  const { setHuntData, activePoint, validatePoint } = useHuntSession()

  useEffect(() => {
    setHuntData({ points, completedPointIds, totalScore, huntId, reward })
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [
    huntId,
    completedPointIds.length,
    totalScore,
    reward?.claimed,
    reward?.eligible,
  ])

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
