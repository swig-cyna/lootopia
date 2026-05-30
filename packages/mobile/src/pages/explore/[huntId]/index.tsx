import "mapbox-gl/dist/mapbox-gl.css"

import { Button } from "@lootopia/mobile/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@lootopia/mobile/components/ui/empty"
import ExplorePointsOverlay from "@lootopia/mobile/features/map/components/ExplorePointsOverlay"
import MapCanvas from "@lootopia/mobile/features/map/components/MapCanvas"
import {
  HuntMapProvider,
  useHuntMap,
} from "@lootopia/mobile/features/map/context/HuntMapContext"
import {
  api,
  getQueryKey,
  useMutation,
  useQuery,
} from "@lootopia/mobile/lib/api"
import queryClient from "@lootopia/mobile/lib/queryClient"
import { ArrowLeft, CheckCircle2, LoaderCircle, MapPin } from "lucide-react"
import { useNavigate, useParams } from "react-router"

const ExploreDetailContent = () => {
  const { huntId } = useParams<{ huntId: string }>()
  const navigate = useNavigate()
  const { mapReady } = useHuntMap()

  const {
    data: hunt,
    isPending,
    isError,
  } = useQuery(api.hunts.published[":huntId"], { param: { huntId: huntId! } })

  const [joinHunt, { isPending: isJoining }] = useMutation(
    api.hunts[":huntId"].join.$post,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getQueryKey(api.hunts.published),
        })
        queryClient.invalidateQueries({
          queryKey: getQueryKey(api.hunts.mine),
        })
        queryClient.invalidateQueries({
          queryKey: getQueryKey(api.hunts.published[":huntId"], {
            param: { huntId: huntId! },
          }),
        })
      },
    },
  )

  const handleGoBack = () => navigate("/explore")
  const handleJoin = () => joinHunt({ param: { huntId: huntId! } })
  const handleStart = () => navigate(`/hunts/${huntId}`)

  if (isPending) {
    return (
      <div className="flex min-h-svh flex-1 flex-col items-center justify-center">
        <LoaderCircle className="text-primary size-8 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Hunt not found</EmptyTitle>
          <EmptyDescription>
            This hunt may have been removed or is no longer available.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={handleGoBack}>
            Go back
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex h-svh flex-col">
      <div className="relative flex h-[45vh] shrink-0 flex-col overflow-hidden rounded-b-2xl">
        <MapCanvas />
        <ExplorePointsOverlay points={hunt.points} />
        <button
          onClick={handleGoBack}
          className="absolute left-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg transition-transform hover:bg-gray-100 active:scale-95"
        >
          <ArrowLeft className="size-5 text-gray-700" />
        </button>
        {!mapReady && (
          <div className="bg-muted absolute inset-0 z-20 flex items-center justify-center">
            <LoaderCircle className="text-primary size-8 animate-spin" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold">{hunt.title}</h1>
          <div className="bg-muted flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1">
            <MapPin className="text-muted-foreground size-3" />
            <span className="text-muted-foreground text-xs font-medium">
              {hunt.points.length}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">{hunt.description}</p>
      </div>

      <div className="bg-background flex flex-col gap-2 p-4 pb-6">
        {hunt.isJoined && (
          <Button
            className="h-14 w-full text-base"
            size="lg"
            onClick={handleStart}
          >
            <MapPin className="size-5" />
            Start hunt
          </Button>
        )}
        {!hunt.isJoined && (
          <Button
            className="h-14 w-full text-base"
            size="lg"
            loading={isJoining}
            onClick={handleJoin}
          >
            <MapPin className="size-5" />
            Join hunt
          </Button>
        )}
        {hunt.isJoined && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-green-600">
            <CheckCircle2 className="size-3.5" />
            You already joined this hunt
          </div>
        )}
      </div>
    </div>
  )
}

const ExploreDetailPage = () => (
  <HuntMapProvider>
    <ExploreDetailContent />
  </HuntMapProvider>
)

export default ExploreDetailPage
