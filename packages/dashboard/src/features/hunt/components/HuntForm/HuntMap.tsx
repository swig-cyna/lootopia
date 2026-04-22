import { Card } from "@lootopia/dashboard/components/ui/card"
import { SearchBox } from "@mapbox/search-js-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { type RefObject } from "react"

interface HuntMapProps {
  mapContainerRef: RefObject<HTMLDivElement | null>
  mapInstance: mapboxgl.Map | null
}

const HuntMap = ({ mapContainerRef, mapInstance }: HuntMapProps) => (
  <Card className="flex-1 min-h-0 relative w-full h-full p-0">
    <div ref={mapContainerRef} className="w-full h-full rounded-xl min-h-100" />
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

export default HuntMap
