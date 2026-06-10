import { useHuntMap } from "@lootopia/mobile/features/map/context/HuntMapContext"
import mapboxgl from "mapbox-gl"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const UserMarkerInner = ({ map }: { map: mapboxgl.Map }) => {
  const { userPosition, heading } = useHuntMap()
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const markerElRef = useRef<HTMLDivElement>(document.createElement("div"))

  useEffect(() => {
    if (!userPosition) {
      return
    }

    const el = markerElRef.current
    markerRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
      .setLngLat(userPosition)
      .addTo(map)

    // oxlint-disable-next-line consistent-return
    return () => {
      markerRef.current?.remove()
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  useEffect(() => {
    if (userPosition) {
      markerRef.current?.setLngLat(userPosition)
    }
  }, [userPosition])

  if (!userPosition) {
    return null
  }

  return createPortal(
    <div className="relative flex h-12 w-12 items-center justify-center">
      {heading !== null && (
        <div
          className="absolute inset-0"
          style={{ transform: `rotate(${heading}deg)` }}
        >
          <div className="absolute top-1 left-1/2 h-0 w-0 -translate-x-1/2 border-r-[6px] border-b-10 border-l-[6px] border-r-transparent border-b-blue-500 border-l-transparent opacity-90" />
        </div>
      )}
      <div className="absolute h-6 w-6 animate-ping rounded-full bg-blue-500 opacity-75" />
      <div className="relative z-10 h-6 w-6 rounded-full border-[3px] border-white bg-blue-500 shadow-md" />
    </div>,
    markerElRef.current,
  )
}

const UserMarker = () => {
  const { mapRef, mapReady, userPosition } = useHuntMap()

  if (!mapReady || !mapRef.current || !userPosition) {
    return null
  }

  return <UserMarkerInner map={mapRef.current} />
}

export default UserMarker
