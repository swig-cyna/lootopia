import { useUserLocation } from "@lootopia/mobile/features/map/hooks/useUserLocation"
import { getDistance } from "@lootopia/mobile/features/map/utils/distance"
import type { Map } from "mapbox-gl"
import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react"

type HuntPoint = {
  id: string
  longitude: number
  latitude: number
  position: number
}

type HuntMapContextValue = {
  mapRef: RefObject<Map | null>
  mapReady: boolean
  onMapReady: (_map: Map) => void
  userPosition: [number, number] | null
  heading: number | null
  centerOnGPS: () => Promise<void>
  distanceToPoint: (_point: HuntPoint) => number | null
  flyToPoint: (_point: HuntPoint) => void
  debugPosition: [number, number] | null
  setDebugPosition: (_pos: [number, number] | null) => void
}

const HuntMapContext = createContext<HuntMapContextValue | null>(null)

export const useHuntMap = () => {
  const ctx = useContext(HuntMapContext)

  if (!ctx) {
    throw new Error("useHuntMap must be used inside HuntMapProvider")
  }

  return ctx
}

export const HuntMapProvider = ({ children }: { children: ReactNode }) => {
  const mapRef = useRef<Map | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [debugPosition, setDebugPosition] = useState<[number, number] | null>(
    null,
  )
  const {
    userPosition: gpsPosition,
    heading,
    centerOnGPS,
  } = useUserLocation(mapRef)

  const userPosition = debugPosition ?? gpsPosition

  const onMapReady = (map: Map) => {
    mapRef.current = map
    setMapReady(true)
  }

  const distanceToPoint = (point: HuntPoint) => {
    if (!userPosition) {
      return null
    }

    return getDistance(userPosition, [point.longitude, point.latitude])
  }

  const flyToPoint = (point: HuntPoint) => {
    mapRef.current?.flyTo({
      center: [point.longitude, point.latitude],
      zoom: 15,
    })
  }

  return (
    <HuntMapContext.Provider
      value={{
        mapRef,
        mapReady,
        onMapReady,
        userPosition,
        heading,
        centerOnGPS,
        distanceToPoint,
        flyToPoint,
        debugPosition,
        setDebugPosition,
      }}
    >
      {children}
    </HuntMapContext.Provider>
  )
}
