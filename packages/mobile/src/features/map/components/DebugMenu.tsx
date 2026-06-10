import { useHuntMap } from "@lootopia/mobile/features/map/context/HuntMapContext"
import { Bug, X } from "lucide-react"
import type { MapMouseEvent } from "mapbox-gl"
import { useEffect, useState } from "react"

const DebugMenu = () => {
  const { mapRef, mapReady, debugPosition, setDebugPosition, userPosition } =
    useHuntMap()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!mapReady || !mapRef.current || !open) {
      return
    }

    const map = mapRef.current

    const onClick = (e: MapMouseEvent) => {
      setDebugPosition([e.lngLat.lng, e.lngLat.lat])
    }

    map.on("click", onClick)

    // eslint-disable-next-line consistent-return
    return () => {
      map.off("click", onClick)
    }
  }, [mapReady, open])

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="absolute top-16 right-4 z-20 rounded-full bg-white p-2 shadow-lg transition-transform hover:bg-gray-100 active:scale-95"
      >
        <Bug className="size-5 text-yellow-500" />
      </button>

      {open && (
        <div className="absolute top-28 right-4 z-20 flex w-52 flex-col gap-2 rounded-xl bg-black/85 p-3 text-xs text-white shadow-xl">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-yellow-400">Debug mode</span>
            <button onClick={() => setOpen(false)}>
              <X className="size-3" />
            </button>
          </div>

          <p className="leading-snug text-white/60">
            Tap anywhere on the map to simulate your position.
          </p>

          {debugPosition ? (
            <div className="flex flex-col gap-1">
              <div className="rounded-lg bg-white/10 px-2 py-1.5">
                <p className="text-[10px] text-white/50">Simulated position</p>
                <p className="font-mono">
                  {debugPosition[1].toFixed(5)}, {debugPosition[0].toFixed(5)}
                </p>
              </div>
              <button
                onClick={() => setDebugPosition(null)}
                className="px-1 text-left text-[10px] text-red-400"
              >
                Clear simulation
              </button>
            </div>
          ) : (
            <p className="text-white/40 italic">No simulated position yet</p>
          )}

          {userPosition && (
            <div className="flex flex-col gap-0.5 rounded-lg bg-white/5 px-2 py-1.5">
              <p className="text-[10px] text-white/50">Active position</p>
              <p className="font-mono text-[10px]">
                {userPosition[1].toFixed(5)}, {userPosition[0].toFixed(5)}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default DebugMenu
