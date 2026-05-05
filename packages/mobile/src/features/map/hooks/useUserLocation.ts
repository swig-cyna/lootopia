import type { Map } from "mapbox-gl"
import { useRef, useState, type RefObject } from "react"

type IOSDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission: () => Promise<"granted" | "denied">
}

export const useUserLocation = (mapRef: RefObject<Map | null>) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  )
  const [heading, setHeading] = useState<number | null>(null)
  const orientationListening = useRef(false)

  const startOrientationListener = () => {
    if (orientationListening.current) {
      return
    }

    orientationListening.current = true

    const handler = (e: DeviceOrientationEvent) => {
      const webkit = (
        e as DeviceOrientationEvent & { webkitCompassHeading?: number }
      ).webkitCompassHeading
      const computed = e.alpha !== null ? (360 - e.alpha) % 360 : null
      const h = webkit ?? computed

      if (h !== null && h !== undefined) {
        setHeading(h)
      }
    }

    window.addEventListener(
      "deviceorientationabsolute",
      handler as EventListener,
    )
    window.addEventListener("deviceorientation", handler as EventListener)
  }

  const centerOnGPS = async () => {
    if (!navigator.geolocation) {
      return
    }

    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as IOSDeviceOrientationEvent)
        .requestPermission === "function"
    ) {
      const perm = await (
        DeviceOrientationEvent as unknown as IOSDeviceOrientationEvent
      ).requestPermission()

      if (perm === "granted") {
        startOrientationListener()
      }
    } else {
      startOrientationListener()
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords
        const map = mapRef.current

        if (!map) {
          return
        }

        map.flyTo({ center: [longitude, latitude], zoom: 15 })
        setUserPosition([longitude, latitude])
      },
      (err) => console.error("Geolocation error:", err.message),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return { userPosition, heading, centerOnGPS }
}
