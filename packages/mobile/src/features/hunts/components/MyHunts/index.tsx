import { Button } from "@lootopia/mobile/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@lootopia/mobile/components/ui/empty"
import HuntCardSkeleton from "@lootopia/mobile/features/hunts/components/HuntCardSkeleton"
import MyHuntCard from "@lootopia/mobile/features/hunts/components/MyHunts/MyHuntCard"
import useIntersectionObserver from "@lootopia/mobile/hooks/useIntersectionObserver"
import { api, useInfiniteQuery } from "@lootopia/mobile/lib/api"
import { LocateOff } from "lucide-react"
import { useCallback } from "react"
import { useNavigate } from "react-router"

const MyHunts = () => {
  const navigate = useNavigate()

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(api.hunts.mine, { query: {} })

  const handleFetchNext = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const sentinelRef = useIntersectionObserver(handleFetchNext, hasNextPage)

  const handleExplore = () => navigate("/explore")

  if (isPending) {
    return <HuntCardSkeleton count={2} />
  }

  if (isError) {
    return (
      <p className="text-destructive text-sm">
        Failed to load your hunts. Please try again.
      </p>
    )
  }

  const hunts = data.pages.flatMap((page) => page.data)

  if (hunts.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia className="size-14" variant="icon">
            <LocateOff className="size-8" />
          </EmptyMedia>
          <EmptyTitle>No hunts found</EmptyTitle>
          <EmptyDescription>Join a hunt to get started</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="lg" onClick={handleExplore}>
            Explore hunts
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {hunts.map((hunt) => (
        <MyHuntCard key={hunt.id} hunt={hunt} />
      ))}
      <div ref={sentinelRef} />
      {isFetchingNextPage && <HuntCardSkeleton count={2} />}
    </div>
  )
}

export default MyHunts
