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
  <Card className="relative h-full min-h-0 w-full flex-1 p-0">
    <div ref={mapContainerRef} className="min-h-100 h-full w-full rounded-xl" />
    <div className="absolute left-3 top-3 z-10 w-80 max-w-[calc(100%-1.5rem)]">
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
