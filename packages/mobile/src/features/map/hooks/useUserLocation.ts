import type { Map } from "mapbox-gl"
import { useEffect, useRef, useState, type RefObject } from "react"

type IOSDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission: () => Promise<"granted" | "denied">
}

export const useUserLocation = (mapRef: RefObject<Map | null>) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  )
  const [heading, setHeading] = useState<number | null>(null)
  const orientationListening = useRef(false)
  const watchIdRef = useRef<number | null>(null)
  const prevRawHeading = useRef<number | null>(null)

  const startOrientationListener = () => {
    if (orientationListening.current) {
      return
    }

    orientationListening.current = true

    const processHeading = (raw: number) => {
      if (prevRawHeading.current === null) {
        prevRawHeading.current = raw
        setHeading(raw)

        return
      }

      let delta = raw - prevRawHeading.current

      if (delta > 180) {
        delta -= 360
      }

      if (delta < -180) {
        delta += 360
      }

      prevRawHeading.current = raw
      setHeading((prev) => (prev === null ? raw : prev + delta))
    }

    const handler = (e: DeviceOrientationEvent) => {
      const webkit = (
        e as DeviceOrientationEvent & { webkitCompassHeading?: number }
      ).webkitCompassHeading
      const computed = e.alpha !== null ? (360 - e.alpha) % 360 : null
      const h = webkit ?? computed

      if (h !== null && h !== undefined) {
        processHeading(h)
      }
    }

    let hasAbsolute = false

    const absoluteHandler = (e: DeviceOrientationEvent) => {
      hasAbsolute = true
      handler(e)
    }

    const relativeHandler = (e: DeviceOrientationEvent) => {
      if (!hasAbsolute) {
        handler(e)
      }
    }

    window.addEventListener(
      "deviceorientationabsolute",
      absoluteHandler as EventListener,
    )
    window.addEventListener(
      "deviceorientation",
      relativeHandler as EventListener,
    )
  }

  const flyToPosition = (position: [number, number]) => {
    mapRef.current?.flyTo({ center: position, zoom: 15 })
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

    if (watchIdRef.current !== null) {
      if (userPosition) {
        flyToPosition(userPosition)
      }

      return
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPosition([pos.coords.longitude, pos.coords.latitude])
      },
      (err) => console.error("Geolocation error:", err.message),
      { enableHighAccuracy: true, timeout: 10000 },
    )

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position: [number, number] = [
          pos.coords.longitude,
          pos.coords.latitude,
        ]
        setUserPosition(position)
        flyToPosition(position)
      },
      (err) => console.error("Geolocation error:", err.message),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  useEffect(
    () => () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    },
    [],
  )

  return { userPosition, heading, centerOnGPS }
}
