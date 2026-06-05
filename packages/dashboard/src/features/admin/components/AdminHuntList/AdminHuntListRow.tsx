import { HUNT_STATUS } from "@lootopia/common/constants/hunt"
import { Badge } from "@lootopia/dashboard/components/ui/badge"
import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lootopia/dashboard/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lootopia/dashboard/components/ui/popover"
import { TableCell, TableRow } from "@lootopia/dashboard/components/ui/table"
import { useAdminHuntListContext } from "@lootopia/dashboard/features/admin/components/AdminHuntList/AdminHuntList.context"
import { HUNT_STATUS_BADGE } from "@lootopia/dashboard/features/admin/constants"
import type { AdminHunt } from "@lootopia/dashboard/features/admin/hooks/useAdminHunts"
import { cn } from "@lootopia/dashboard/lib/utils"
import { Eye, EyeOff, MoreVertical, Trash2 } from "lucide-react"
import { useState } from "react"

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
})

const formatDate = (value: string | Date) =>
  DATE_FORMATTER.format(value instanceof Date ? value : new Date(value))

const AdminHuntListRow = ({ hunt }: { hunt: AdminHunt }) => {
  const { data } = useAdminHuntListContext()
  const { toggleStatus, deleteHunt, isMutating } = data

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const isPublished = hunt.status === HUNT_STATUS.PUBLISHED
  const statusBadge = HUNT_STATUS_BADGE[hunt.status]

  const handleToggleStatus = () => {
    toggleStatus(hunt)
    setIsMenuOpen(false)
  }

  const handleAskDelete = () => {
    setIsMenuOpen(false)
    setIsConfirmOpen(true)
  }

  const handleCloseConfirm = () => setIsConfirmOpen(false)

  const handleConfirmDelete = () => {
    deleteHunt(hunt.id)
    setIsConfirmOpen(false)
  }

  return (
    <TableRow className="hover:bg-muted/40">
      <TableCell>
        <span className="truncate font-medium">{hunt.title}</span>
      </TableCell>

      <TableCell>
        {hunt.organizer ? (
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-medium">
              {hunt.organizer.name}
            </span>
            <span className="text-muted-foreground truncate text-xs">
              {hunt.organizer.email}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell className="text-muted-foreground tabular-nums">
        {hunt.points.length}
      </TableCell>

      <TableCell>
        <Badge className={cn("gap-1.5", statusBadge.className)}>
          {isPublished && (
            <span className="size-1.5 rounded-full bg-green-500" />
          )}
          {statusBadge.label}
        </Badge>
      </TableCell>

      <TableCell className="text-muted-foreground tabular-nums">
        {hunt.playerCount > 0 ? hunt.playerCount : "—"}
      </TableCell>

      <TableCell>
        {hunt.playerCount > 0 ? (
          <div className="flex items-center gap-2">
            <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${hunt.completionRate}%` }}
              />
            </div>
            <span className="text-muted-foreground w-9 text-right text-xs tabular-nums">
              {hunt.completionRate}%
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell className="text-muted-foreground text-sm">
        {formatDate(hunt.createdAt)}
      </TableCell>

      <TableCell>
        <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-1">
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={isMutating}
              className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm disabled:opacity-50"
            >
              {isPublished ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
              {isPublished ? "Unpublish" : "Publish"}
            </button>
            <button
              type="button"
              onClick={handleAskDelete}
              className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
            >
              <Trash2 className="size-4" />
              Delete
            </button>
          </PopoverContent>
        </Popover>

        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this hunt?</DialogTitle>
              <DialogDescription>
                "{hunt.title}" will be permanently deleted. This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseConfirm}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                loading={isMutating}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  )
}

export default AdminHuntListRow
