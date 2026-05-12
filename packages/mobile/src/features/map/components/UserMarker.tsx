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

    // eslint-disable-next-line consistent-return
    return () => {
      markerRef.current?.remove()
    }
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
    <div
      className="relative h-6 w-6"
      style={{
        transform: heading !== null ? `rotate(${heading}deg)` : undefined,
      }}
    >
      {heading !== null && (
        <div className="absolute bottom-full left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-blue-500 opacity-85" />
      )}
      <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-75" />
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
