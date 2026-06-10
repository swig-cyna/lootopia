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
import { useAdminHuntListContext } from "@lootopia/dashboard/features/admin/components/AdminHuntList/AdminHuntList.context"
import AdminHuntListRow from "@lootopia/dashboard/features/admin/components/AdminHuntList/AdminHuntListRow"

const COLUMN_HEADERS = [
  "Hunt",
  "Organizer",
  "Steps",
  "Status",
  "Players",
  "Completion",
  "Created",
]

const COLUMN_COUNT = COLUMN_HEADERS.length + 1

const SKELETON_ROWS = Array.from({ length: 5 })

const AdminHuntListTable = () => {
  const { data } = useAdminHuntListContext()
  const { hunts, isLoading } = data

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {COLUMN_HEADERS.map((header) => (
              <TableHead
                key={header}
                className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
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
                {Array.from({ length: COLUMN_COUNT }).map((__, cell) => (
                  <TableCell key={cell}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && hunts.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={COLUMN_COUNT} className="py-16 text-center">
                <p className="text-muted-foreground text-sm">
                  No hunts match your filters.
                </p>
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            hunts.map((hunt) => <AdminHuntListRow key={hunt.id} hunt={hunt} />)}
        </TableBody>
      </Table>
    </Card>
  )
}

export default AdminHuntListTable
