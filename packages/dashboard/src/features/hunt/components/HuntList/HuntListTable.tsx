import { Button } from "@lootopia/dashboard/components/ui/button"
import { Card } from "@lootopia/dashboard/components/ui/card"
import { Skeleton } from "@lootopia/dashboard/components/ui/skeleton"
import { useHuntListContext } from "@lootopia/dashboard/features/hunt/components/HuntList/HuntList.context"
import HuntListRow from "@lootopia/dashboard/features/hunt/components/HuntList/HuntListRow"
import { HUNT_LIST_GRID_COLS } from "@lootopia/dashboard/features/hunt/utils/constants"
import { cn } from "@lootopia/dashboard/lib/utils"

const COLUMN_HEADERS = [
  "Hunt",
  "Steps",
  "Status",
  "Players",
  "Completion",
  "Created",
]

const SKELETON_ROWS = Array.from({ length: 5 })

const HuntListTable = () => {
  const { data } = useHuntListContext()
  const { hunts, counts, isLoading, goToCreate } = data

  return (
    <Card className="gap-0 py-0">
      <div
        className={cn(
          HUNT_LIST_GRID_COLS,
          "text-muted-foreground border-b px-4 py-2.5 text-xs font-medium uppercase tracking-wide",
        )}
      >
        {COLUMN_HEADERS.map((header) => (
          <span key={header}>{header}</span>
        ))}
        <span />
      </div>

      {isLoading &&
        SKELETON_ROWS.map((_, index) => (
          <div
            key={index}
            className={cn(
              HUNT_LIST_GRID_COLS,
              "border-b px-4 py-3 last:border-0",
            )}
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-md" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-1.5 w-full rounded-full" />
            <Skeleton className="h-4 w-12" />
            <span />
          </div>
        ))}

      {!isLoading && hunts.length === 0 && (
        <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
          <p className="text-muted-foreground text-sm">
            {counts.all === 0
              ? "You haven't created any hunts yet."
              : "No hunts match your filters."}
          </p>
          {counts.all === 0 && <Button onClick={goToCreate}>New hunt</Button>}
        </div>
      )}

      {!isLoading &&
        hunts.map((hunt) => <HuntListRow key={hunt.id} hunt={hunt} />)}
    </Card>
  )
}

export default HuntListTable
