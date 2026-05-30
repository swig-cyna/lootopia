import { Button } from "@lootopia/dashboard/components/ui/button"
import { Card } from "@lootopia/dashboard/components/ui/card"
import { Skeleton } from "@lootopia/dashboard/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@lootopia/dashboard/components/ui/table"
import { useHuntListContext } from "@lootopia/dashboard/features/hunt/components/HuntList/HuntList.context"
import HuntListRow from "@lootopia/dashboard/features/hunt/components/HuntList/HuntListRow"

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
    <Card className="gap-0 overflow-hidden py-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {COLUMN_HEADERS.map((header) => (
              <TableHead
                key={header}
                className="text-muted-foreground text-xs font-medium uppercase tracking-wide"
              >
                {header}
              </TableHead>
            ))}
            <TableHead className="w-11" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            SKELETON_ROWS.map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-11 rounded-md" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell />
              </TableRow>
            ))}

          {!isLoading && hunts.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <p className="text-muted-foreground text-sm">
                    {counts.all === 0
                      ? "You haven't created any hunts yet."
                      : "No hunts match your filters."}
                  </p>
                  {counts.all === 0 && (
                    <Button onClick={goToCreate}>New hunt</Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            hunts.map((hunt) => <HuntListRow key={hunt.id} hunt={hunt} />)}
        </TableBody>
      </Table>
    </Card>
  )
}

export default HuntListTable
