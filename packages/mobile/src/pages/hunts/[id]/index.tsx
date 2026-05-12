import "mapbox-gl/dist/mapbox-gl.css"

import HuntSession from "@lootopia/mobile/features/hunts/components/HuntSession"
import {
  type HuntPoint,
  HuntSessionProvider,
} from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import DebugMenu from "@lootopia/mobile/features/map/components/DebugMenu"
import MapCanvas from "@lootopia/mobile/features/map/components/MapCanvas"
import MapControls from "@lootopia/mobile/features/map/components/MapControls"
import UserMarker from "@lootopia/mobile/features/map/components/UserMarker"
import { HuntMapProvider } from "@lootopia/mobile/features/map/context/HuntMapContext"
import { api, useQuery } from "@lootopia/mobile/lib/api"
import { ArrowLeft, LoaderCircle } from "lucide-react"
import { useNavigate, useParams } from "react-router"

const HuntPageContent = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    data: hunt,
    isPending,
    isError,
  } = useQuery(api.hunts[":id"], {
    param: { id: id! },
  })

  if (isPending) {
    return (
      <div className="flex min-h-svh flex-1 flex-col items-center justify-center">
        <LoaderCircle className="text-primary size-8 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-svh flex-1 flex-col items-center justify-center gap-4">
        <p className="text-destructive text-sm">Hunt not found.</p>
        <button onClick={() => navigate("/")} className="text-sm underline">
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex h-svh touch-none flex-col overflow-hidden">
      <MapCanvas />
      <UserMarker />
      <HuntSession points={hunt.points as HuntPoint[]} />

      <button
        onClick={() => navigate("/")}
        className="absolute left-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg transition-transform hover:bg-gray-100 active:scale-95"
      >
        <ArrowLeft className="size-5 text-gray-700" />
      </button>
      <MapControls />
      {import.meta.env.DEV && <DebugMenu />}
    </div>
  )
}

const HuntPage = () => (
  <HuntMapProvider>
    <HuntSessionProvider>
      <HuntPageContent />
    </HuntSessionProvider>
  </HuntMapProvider>
)

export default HuntPage
