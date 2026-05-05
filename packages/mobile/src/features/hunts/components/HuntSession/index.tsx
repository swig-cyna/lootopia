import HuntInfoPanel from "@lootopia/mobile/features/hunts/components/HuntSession/HuntInfoPanel"
import PointActivitySheet from "@lootopia/mobile/features/hunts/components/PointActivitySheet"
import {
  type HuntPoint,
  useHuntSession,
} from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import HuntPointsOverlay from "@lootopia/mobile/features/map/components/HuntPointsOverlay"
import { useEffect } from "react"

const HuntSession = ({ points }: { points: HuntPoint[] }) => {
  const { setPoints, activePoint, validatePoint } = useHuntSession()

  useEffect(() => {
    setPoints(points)
  }, [points])

  return (
    <>
      <HuntPointsOverlay />
      <HuntInfoPanel />
      {activePoint && (
        <PointActivitySheet point={activePoint} onValidate={validatePoint} />
      )}
    </>
  )
}

export default HuntSession
