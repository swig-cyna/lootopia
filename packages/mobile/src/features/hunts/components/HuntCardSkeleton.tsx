import { Skeleton } from "@lootopia/mobile/components/ui/skeleton"

type HuntCardSkeletonProps = {
  count?: number
}

const HuntCardSkeleton = ({ count = 3 }: HuntCardSkeletonProps) => (
  <div className="flex w-full flex-col gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-32 w-full rounded-xl" />
    ))}
  </div>
)

export default HuntCardSkeleton
