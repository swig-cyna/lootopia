import { cn } from "@lootopia/mobile/lib/utils"
import mapboxgl from "mapbox-gl"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

type HuntPointMarkerProps = {
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
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  return createPortal(
    <div className="flex flex-col items-center drop-shadow-sm">
      <div
        className={cn(
          "z-1 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white text-xs font-bold",
          isCompleted && "bg-green-500 text-white",
          !isCompleted && isNext && "bg-primary text-primary-foreground",
          !isCompleted && !isNext && "bg-muted-foreground text-white",
        )}
      >
        {label}
      </div>
      <div className={cn("mt-[-6.4px] h-2.5 w-2.5 rotate-45 bg-white")} />
    </div>,
    markerElRef.current,
  )
}

export default HuntPointMarker
