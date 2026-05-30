import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@lootopia/mobile/components/ui/empty"
import ExploreHuntCard from "@lootopia/mobile/features/hunts/components/Explore/ExploreHuntCard"
import HuntCardSkeleton from "@lootopia/mobile/features/hunts/components/HuntCardSkeleton"
import useIntersectionObserver from "@lootopia/mobile/hooks/useIntersectionObserver"
import { api, useInfiniteQuery } from "@lootopia/mobile/lib/api"
import { Map } from "lucide-react"
import { useCallback } from "react"

const Explore = () => {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(api.hunts.published, { query: {} })

  const handleFetchNext = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const sentinelRef = useIntersectionObserver(handleFetchNext, hasNextPage)

  if (isPending) {
    return <HuntCardSkeleton />
  }

  if (isError) {
    return (
      <p className="text-destructive text-sm">
        Failed to load hunts. Please try again.
      </p>
    )
  }

  const hunts = data.pages.flatMap((page) => page.data)

  if (hunts.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia className="size-14" variant="icon">
            <Map className="size-8" />
          </EmptyMedia>
          <EmptyTitle>No hunts available</EmptyTitle>
          <EmptyDescription>
            Check back later for published hunts to join
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {hunts.map((hunt) => (
        <ExploreHuntCard key={hunt.id} hunt={hunt} />
      ))}
      <div ref={sentinelRef} />
      {isFetchingNextPage && <HuntCardSkeleton />}
    </div>
  )
}

export default Explore
