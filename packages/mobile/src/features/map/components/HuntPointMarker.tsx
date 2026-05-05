import { cn } from "@lootopia/mobile/lib/utils"
import mapboxgl from "mapbox-gl"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface HuntPointMarkerProps {
  map: mapboxgl.Map
  position: [number, number]
  label: string
  isNext: boolean
  isCompleted: boolean
}

const HuntPointMarker = ({
  map,
  position,
  label,
  isNext,
  isCompleted,
}: HuntPointMarkerProps) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const markerElRef = useRef<HTMLDivElement>(document.createElement("div"))

  useEffect(() => {
    const el = markerElRef.current
    markerRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
      .setLngLat(position)
      .addTo(map)

    return () => {
      markerRef.current?.remove()
    }
  }, [map])

  return createPortal(
    <div className="flex flex-col items-center drop-shadow-sm">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-[3px] z-1 border-white",
          isCompleted && "bg-green-500 text-white",
          !isCompleted && isNext && "bg-primary text-primary-foreground",
          !isCompleted && !isNext && "bg-muted-foreground text-white",
        )}
      >
        {label}
      </div>
      <div className={cn("w-2.5 h-2.5 rotate-45 mt-[-6.4px] bg-white")} />
    </div>,
    markerElRef.current,
  )
}

export default HuntPointMarker
