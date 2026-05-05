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
import { api, useQuery } from "@lootopia/mobile/lib/api"
import { LocateOff } from "lucide-react"
import { useNavigate } from "react-router"

const MyHunts = () => {
  const navigate = useNavigate()

  const { data, isPending, isError } = useQuery(api.hunts.mine, { query: {} })

  if (isPending) {
    return <HuntCardSkeleton count={2} />
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Failed to load your hunts. Please try again.
      </p>
    )
  }

  if (data.data.length === 0) {
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
          <Button size="lg" onClick={() => navigate("/explore")}>
            Explore hunts
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {data.data.map((hunt) => (
        <MyHuntCard key={hunt.id} hunt={hunt} />
      ))}
    </div>
  )
}

export default MyHunts
