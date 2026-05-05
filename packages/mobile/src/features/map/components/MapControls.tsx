import { useHuntMap } from "@lootopia/mobile/features/map/context/HuntMapContext"
import { Crosshair } from "lucide-react"

const MapControls = () => {
  const { centerOnGPS } = useHuntMap()

  return (
    <button
      onClick={centerOnGPS}
      className="absolute top-4 right-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 active:scale-95 transition-transform"
    >
      <Crosshair className="size-5 text-blue-500" />
    </button>
  )
}

export default MapControls
