import { type Role } from "@lootopia/auth/constants"
import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lootopia/dashboard/components/ui/dialog"
import { FieldError } from "@lootopia/dashboard/components/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@lootopia/dashboard/components/ui/radio-group"
import { useUserListContext } from "@lootopia/dashboard/features/admin/components/UserList/UserList.context"
import { ROLE_OPTIONS } from "@lootopia/dashboard/features/admin/constants"
import type { AdminUser } from "@lootopia/dashboard/features/admin/hooks/useAdminUsers"
import { useState } from "react"

type ChangeRoleDialogProps = {
  user: AdminUser
  open: boolean
  onOpenChange: (_open: boolean) => void
}

const DEFAULT_ROLE: Role = "player"

const ChangeRoleDialog = ({
  user,
  open,
  onOpenChange,
}: ChangeRoleDialogProps) => {
  const { data } = useUserListContext()
  const { changeRole, isMutating } = data

  const [selectedRole, setSelectedRole] = useState<Role>(
    (user.role as Role | null) ?? DEFAULT_ROLE,
  )
  const [error, setError] = useState<string | null>(null)

  const handleRoleChange = (value: string) => setSelectedRole(value as Role)

  const handleCancel = () => onOpenChange(false)

  const handleConfirm = async () => {
    setError(null)

    try {
      await changeRole(user.id, selectedRole)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>
            Update the role for {user.email}.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={selectedRole} onValueChange={handleRoleChange}>
          {ROLE_OPTIONS.map((option) => (
            <label
              key={option.value}
              htmlFor={`role-${option.value}`}
              className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm"
            >
              <RadioGroupItem
                id={`role-${option.value}`}
                value={option.value}
              />
              {option.label}
            </label>
          ))}
        </RadioGroup>

        {error && <FieldError>{error}</FieldError>}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} loading={isMutating}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeRoleDialog
