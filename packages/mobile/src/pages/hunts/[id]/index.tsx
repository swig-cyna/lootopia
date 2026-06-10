import "mapbox-gl/dist/mapbox-gl.css"

import HuntSession from "@lootopia/mobile/features/hunts/components/HuntSession"
import { HuntSessionProvider } from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import DebugMenu from "@lootopia/mobile/features/map/components/DebugMenu"
import MapCanvas from "@lootopia/mobile/features/map/components/MapCanvas"
import MapControls from "@lootopia/mobile/features/map/components/MapControls"
import UserMarker from "@lootopia/mobile/features/map/components/UserMarker"
import {
  HuntMapProvider,
  useHuntMap,
} from "@lootopia/mobile/features/map/context/HuntMapContext"
import { api, useQuery } from "@lootopia/mobile/lib/api"
import { ArrowLeft, LoaderCircle } from "lucide-react"
import { useNavigate, useParams } from "react-router"

const HuntPageContent = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { mapReady } = useHuntMap()

  const {
    data: hunt,
    isPending,
    isError,
  } = useQuery(api.hunts.published[":huntId"], {
    param: { huntId: id! },
  })

  const handleGoBack = () => {
    navigate("/")
  }

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
        <button onClick={handleGoBack} className="text-sm underline">
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex h-svh touch-none flex-col overflow-hidden">
      <MapCanvas />
      <UserMarker />
      <HuntSession
        huntId={id!}
        points={hunt.points}
        completedPointIds={hunt.completedPointIds}
        totalScore={hunt.totalScore}
        reward={hunt.reward}
      />

      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 z-10 rounded-full bg-white p-2 shadow-lg transition-transform hover:bg-gray-100 active:scale-95"
      >
        <ArrowLeft className="size-5 text-gray-700" />
      </button>
      <MapControls />
      {import.meta.env.DEV && <DebugMenu />}
      {!mapReady && (
        <div className="bg-muted absolute inset-0 z-20 flex items-center justify-center">
          <LoaderCircle className="text-primary size-8 animate-spin" />
        </div>
      )}
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
