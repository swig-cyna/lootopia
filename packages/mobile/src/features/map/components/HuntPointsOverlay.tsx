import HuntPointMarker from "@lootopia/mobile/features/map/components/HuntPointMarker"
import { useHuntSession } from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import { useHuntMap } from "@lootopia/mobile/features/map/context/HuntMapContext"

const HuntPointsOverlay = () => {
  const { mapRef, mapReady } = useHuntMap()
  const { sortedPoints, completedIds } = useHuntSession()

  if (!mapReady || !mapRef.current) {
    return null
  }

  const firstPendingIndex = sortedPoints.findIndex(
    (p) => !completedIds.has(p.id),
  )

  return sortedPoints.map((point, i) => (
    <HuntPointMarker
      key={point.id}
      map={mapRef.current!}
      position={[point.longitude, point.latitude]}
      label={String(point.position)}
      isNext={i === firstPendingIndex}
      isCompleted={completedIds.has(point.id)}
    />
  ))
}

export default HuntPointsOverlay
