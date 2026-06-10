import HuntPointMarker from "@lootopia/mobile/features/map/components/HuntPointMarker"
import { useHuntMap } from "@lootopia/mobile/features/map/context/HuntMapContext"
import mapboxgl from "mapbox-gl"
import { useEffect } from "react"

type Point = {
  id: string
  longitude: number
  latitude: number
  position: number
}

type ExplorePointsOverlayProps = {
  points: Point[]
}

const ExplorePointsOverlay = ({ points }: ExplorePointsOverlayProps) => {
  const { mapRef, mapReady } = useHuntMap()

  useEffect(() => {
    if (!mapReady || !mapRef.current || points.length === 0) {
      return
    }

    const bounds = new mapboxgl.LngLatBounds()
    points.forEach((p) => {
      bounds.extend([p.longitude, p.latitude])
    })
    mapRef.current.fitBounds(bounds, {
      padding: 80,
      duration: 0,
    })
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady])

  if (!mapReady || !mapRef.current) {
    return null
  }

  return points.map((point) => (
    <HuntPointMarker
      key={point.id}
      map={mapRef.current!}
      position={[point.longitude, point.latitude]}
      label={String(point.position)}
      isNext={true}
      isCompleted={false}
    />
  ))
}

export default ExplorePointsOverlay
