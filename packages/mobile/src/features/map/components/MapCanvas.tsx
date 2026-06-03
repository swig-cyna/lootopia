import { useHuntMap } from "@lootopia/mobile/features/map/context/HuntMapContext"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef } from "react"

const HIDDEN_LAYERS = [
  "poi-label",
  "transit-label",
  "road-label",
  "road-number-shield",
  "road-exit-shield",
  "airport-label",
  "settlement-minor-label",
  "settlement-major-label",
  "settlement-subdivision-label",
  "state-label",
  "country-label",
]

const MapCanvas = () => {
  const { onMapReady } = useHuntMap()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    const observer = new ResizeObserver(() => {
      mapRef.current?.resize()
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [2.3522, 48.8566],
      zoom: 13,
      maxZoom: 18,
    })

    mapRef.current = map

    map.on("load", () => {
      HIDDEN_LAYERS.forEach((layer) => {
        if (map.getLayer(layer)) {
          map.setLayoutProperty(layer, "visibility", "none")
        }
      })
      onMapReady(map)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="w-full flex-1" />
}

export default MapCanvas
