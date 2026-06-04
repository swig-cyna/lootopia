import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@lootopia/mobile/components/ui/empty"
import { Skeleton } from "@lootopia/mobile/components/ui/skeleton"
import LeaderboardEntry from "@lootopia/mobile/features/hunts/components/LeaderboardList/LeaderboardEntry"
import { useLeaderboardList } from "@lootopia/mobile/features/hunts/components/LeaderboardList/LeaderboardList.context"
import useIntersectionObserver from "@lootopia/mobile/hooks/useIntersectionObserver"
import { AlertCircle, Users } from "lucide-react"

const LeaderboardEntries = () => {
  const { data } = useLeaderboardList()

  const sentinelRef = useIntersectionObserver(
    data.handleFetchNext,
    data.hasNextPage,
  )

  if (data.isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (data.isError) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia className="size-14" variant="icon">
            <AlertCircle className="size-8" />
          </EmptyMedia>
          <EmptyTitle>Failed to load leaderboard</EmptyTitle>
          <EmptyDescription>Please try again later.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (data.entries.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia className="size-14" variant="icon">
            <Users className="size-8" />
          </EmptyMedia>
          <EmptyTitle>No players found</EmptyTitle>
          <EmptyDescription>No one has joined this hunt yet.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {data.entries.map((entry) => {
        const isCurrentUser = entry.userId === data.currentUserId

        return (
          <LeaderboardEntry
            key={entry.userId}
            entry={entry}
            isCurrentUser={isCurrentUser}
            entryRef={isCurrentUser ? data.myEntryRef : undefined}
          />
        )
      })}
      <div ref={sentinelRef} />
      {data.isFetchingNextPage && (
        <Skeleton className="h-14 w-full rounded-xl" />
      )}
    </div>
  )
}

export default LeaderboardEntries
