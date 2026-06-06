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
import { useUserListContext } from "@lootopia/dashboard/features/admin/components/UserList/UserList.context"
import UserListRow from "@lootopia/dashboard/features/admin/components/UserList/UserListRow"

const COLUMN_HEADERS = ["Name", "Email", "Role", "Status", "Created"]

const SKELETON_ROWS = Array.from({ length: 5 })

const UserListTable = () => {
  const { data } = useUserListContext()
  const { users, isLoading } = data

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
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell />
              </TableRow>
            ))}

          {!isLoading && users.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="py-16 text-center">
                <p className="text-muted-foreground text-sm">
                  No users match your filters.
                </p>
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            users.map((user) => <UserListRow key={user.id} user={user} />)}
        </TableBody>
      </Table>
    </Card>
  )
}

export default UserListTable
