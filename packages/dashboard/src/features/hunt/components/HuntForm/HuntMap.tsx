import { Card } from "@lootopia/dashboard/components/ui/card"
import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { HUNT_GAME_TYPE } from "@lootopia/common/constants/hunt"
import { SearchBox } from "@mapbox/search-js-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef, useState, type RefObject } from "react"
import { createRoot } from "react-dom/client"
import { useFormContext } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"

const MAPBOX_STYLE = "mapbox://styles/mapbox/streets-v11"
const MAP_DEFAULT_CENTER: [number, number] = [2.3522, 48.8566]
const MAP_DEFAULT_ZOOM = 5
const MAP_FIT_PADDING = 80
const MAP_FIT_MAX_ZOOM = 15

type MapPoint = {
  id: string
  lat: number
  lng: number
  marker: mapboxgl.Marker
  root: ReturnType<typeof createRoot>
}

export type HuntMapHandle = {
  removePoint: (_id: string) => void
  reorderPoints: (_orderedIds: string[]) => void
}

type HuntMapProps = {
  handleRef: RefObject<HuntMapHandle | null>
}

const MarkerPin = ({ label }: { label: number }) => (
  <div className="bg-primary text-primary-foreground flex size-8 cursor-grab items-center justify-center rounded-full border-2 border-white text-sm font-semibold shadow-md active:cursor-grabbing">
    {label}
  </div>
)

const buildMarkerElement = (label: number) => {
  const el = document.createElement("div")
  const root = createRoot(el)

  root.render(<MarkerPin label={label} />)

  return { el, root }
}

const HuntMap = ({ handleRef }: HuntMapProps) => {
  const { setValue, getValues } = useFormContext<HuntFormValues>()
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const pointsRef = useRef<MapPoint[]>([])

  const syncFormPoints = () => {
    const existing = getValues("points")
    const existingById = new Map(existing.map((p) => [p.id, p]))

    const merged = pointsRef.current.map((p, index) => {
      const saved = existingById.get(p.id)

      if (saved) {
        return {
          ...saved,
          latitude: p.lat,
          longitude: p.lng,
          position: index + 1,
        }
      }

      return {
        id: p.id,
        latitude: p.lat,
        longitude: p.lng,
        position: index + 1,
        game: { type: HUNT_GAME_TYPE.NONE },
      }
    })

    setValue("points", merged as HuntFormValues["points"])
  }

  const removePoint = (id: string) => {
    const point = pointsRef.current.find((p) => p.id === id)

    point?.marker.remove()

    pointsRef.current = pointsRef.current
      .filter((p) => p.id !== id)
      .map((p, index) => {
        p.root.render(<MarkerPin label={index + 1} />)

        return p
      })

    const existing = getValues("points")
    const updated = existing
      .filter((p) => p.id !== id)
      .map((p, index) => ({ ...p, position: index + 1 }))

    setValue("points", updated as HuntFormValues["points"])
  }

  const reorderPoints = (orderedIds: string[]) => {
    const byId = new Map(pointsRef.current.map((p) => [p.id, p]))

    pointsRef.current = orderedIds
      .map((id) => byId.get(id))
      .filter((p): p is MapPoint => p !== undefined)
      .map((p, index) => {
        p.root.render(<MarkerPin label={index + 1} />)

        return p
      })
  }

  useEffect(() => {
    handleRef.current = { removePoint, reorderPoints }
  })

  const handleMarkerDragEnd = (id: string, marker: mapboxgl.Marker) => () => {
    const { lng, lat } = marker.getLngLat()
    pointsRef.current = pointsRef.current.map((p) =>
      p.id === id ? { ...p, lat, lng } : p,
    )
    syncFormPoints()
  }

  const initExistingMarkers = (map: mapboxgl.Map) => {
    const existing = getValues("points")

    if (existing.length === 0) {
      return
    }

    const bounds = new mapboxgl.LngLatBounds()

    pointsRef.current = existing.map((point, index) => {
      const { el, root } = buildMarkerElement(index + 1)
      const marker = new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat([point.longitude, point.latitude])
        .addTo(map)

      marker.on("dragend", handleMarkerDragEnd(point.id, marker))
      bounds.extend([point.longitude, point.latitude])

      return {
        id: point.id,
        lat: point.latitude,
        lng: point.longitude,
        marker,
        root,
      }
    })

    map.fitBounds(bounds, {
      padding: MAP_FIT_PADDING,
      maxZoom: MAP_FIT_MAX_ZOOM,
      duration: 0,
    })
  }

  const handleMapClick = (map: mapboxgl.Map) => (e: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = e.lngLat
    const id = uuidv4()

    const nextPosition = pointsRef.current.length + 1
    const { el, root } = buildMarkerElement(nextPosition)
    const marker = new mapboxgl.Marker({ element: el, draggable: true })
      .setLngLat([lng, lat])
      .addTo(map)

    pointsRef.current = [...pointsRef.current, { id, lat, lng, marker, root }]

    syncFormPoints()
    marker.on("dragend", handleMarkerDragEnd(id, marker))
  }

  useEffect(() => {
    if (!mapContainerRef.current) {
      return undefined
    }

    const observer = new ResizeObserver(() => {
      mapRef.current?.resize()
    })

    observer.observe(mapContainerRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current) {
      return undefined
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE,
      center: MAP_DEFAULT_CENTER,
      zoom: MAP_DEFAULT_ZOOM,
    })

    mapRef.current = map
    setMapInstance(map)
    map.addControl(new mapboxgl.NavigationControl(), "top-right")
    map.on("click", handleMapClick(map))
    initExistingMarkers(map)

    return () => map.remove()
  }, [])

  return (
    <Card className="relative min-h-0 w-full flex-1 p-0">
      <div
        ref={mapContainerRef}
        className="h-full min-h-100 w-full rounded-xl"
      />
      <div className="absolute top-3 left-3 z-10 w-80 max-w-[calc(100%-1.5rem)]">
        <SearchBox
          accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          map={mapInstance ?? undefined}
          mapboxgl={mapboxgl}
          marker={false}
          placeholder="Search for an address..."
        />
      </div>
    </Card>
  )
}

export default HuntMap
