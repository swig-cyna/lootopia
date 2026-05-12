import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@lootopia/mobile/components/ui/empty"
import ExploreHuntCard from "@lootopia/mobile/features/hunts/components/Explore/ExploreHuntCard"
import HuntCardSkeleton from "@lootopia/mobile/features/hunts/components/HuntCardSkeleton"
import { api, useQuery } from "@lootopia/mobile/lib/api"
import { Map } from "lucide-react"

const Explore = () => {
  const { data, isPending, isError } = useQuery(api.hunts.published, {
    query: {},
  })

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

  if (data.data.length === 0) {
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
      {data.data.map((hunt) => (
        <ExploreHuntCard key={hunt.id} hunt={hunt} />
      ))}
    </div>
  )
}

export default Explore
