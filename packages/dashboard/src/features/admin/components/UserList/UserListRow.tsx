import { type Role } from "@lootopia/auth/constants"
import { Badge } from "@lootopia/dashboard/components/ui/badge"
import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lootopia/dashboard/components/ui/popover"
import { TableCell, TableRow } from "@lootopia/dashboard/components/ui/table"
import BanUserDialog from "@lootopia/dashboard/features/admin/components/UserList/BanUserDialog"
import ChangeRoleDialog from "@lootopia/dashboard/features/admin/components/UserList/ChangeRoleDialog"
import { useUserListContext } from "@lootopia/dashboard/features/admin/components/UserList/UserList.context"
import {
  ROLE_BADGE_VARIANT,
  ROLE_LABEL,
} from "@lootopia/dashboard/features/admin/constants"
import type { AdminUser } from "@lootopia/dashboard/features/admin/hooks/useAdminUsers"
import { Ban, MoreVertical, ShieldCheck, UserCheck } from "lucide-react"
import { useState } from "react"

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

const formatDate = (value: string | Date) =>
  DATE_FORMATTER.format(value instanceof Date ? value : new Date(value))

const UserListRow = ({ user }: { user: AdminUser }) => {
  const { data } = useUserListContext()
  const { unbanUser, isMutating } = data

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRoleOpen, setIsRoleOpen] = useState(false)
  const [isBanOpen, setIsBanOpen] = useState(false)

  const role = user.role as Role | null | undefined
  const roleLabel = (role && ROLE_LABEL[role]) ?? role ?? "—"
  const roleVariant = (role && ROLE_BADGE_VARIANT[role]) ?? "outline"

  const handleOpenRole = () => {
    setIsMenuOpen(false)
    setIsRoleOpen(true)
  }

  const handleOpenBan = () => {
    setIsMenuOpen(false)
    setIsBanOpen(true)
  }

  const handleUnban = () => {
    setIsMenuOpen(false)
    unbanUser(user.id)
  }

  return (
    <TableRow className="hover:bg-muted/40">
      <TableCell className="font-medium">{user.name}</TableCell>

      <TableCell className="text-muted-foreground">{user.email}</TableCell>

      <TableCell>
        <Badge variant={roleVariant}>{roleLabel}</Badge>
      </TableCell>

      <TableCell>
        {user.banned ? (
          <Badge variant="destructive">Banned</Badge>
        ) : (
          <Badge variant="outline">Active</Badge>
        )}
      </TableCell>

      <TableCell className="text-muted-foreground text-sm">
        {formatDate(user.createdAt)}
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
              onClick={handleOpenRole}
              className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
            >
              <ShieldCheck className="size-4" />
              Change role
            </button>
            {user.banned ? (
              <button
                type="button"
                onClick={handleUnban}
                disabled={isMutating}
                className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm disabled:opacity-50"
              >
                <UserCheck className="size-4" />
                Unban
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenBan}
                className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
              >
                <Ban className="size-4" />
                Ban
              </button>
            )}
          </PopoverContent>
        </Popover>

        <ChangeRoleDialog
          user={user}
          open={isRoleOpen}
          onOpenChange={setIsRoleOpen}
        />
        <BanUserDialog
          user={user}
          open={isBanOpen}
          onOpenChange={setIsBanOpen}
        />
      </TableCell>
    </TableRow>
  )
}

export default UserListRow
