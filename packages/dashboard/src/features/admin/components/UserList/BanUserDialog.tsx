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
  Field,
  FieldError,
  FieldLabel,
} from "@lootopia/dashboard/components/ui/field"
import { Input } from "@lootopia/dashboard/components/ui/input"
import { useUserListContext } from "@lootopia/dashboard/features/admin/components/UserList/UserList.context"
import type { AdminUser } from "@lootopia/dashboard/features/admin/hooks/useAdminUsers"
import { type ChangeEvent, useState } from "react"

type BanUserDialogProps = {
  user: AdminUser
  open: boolean
  onOpenChange: (_open: boolean) => void
}

const BanUserDialog = ({ user, open, onOpenChange }: BanUserDialogProps) => {
  const { data } = useUserListContext()
  const { banUser, isMutating } = data

  const [reason, setReason] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleReasonChange = (event: ChangeEvent<HTMLInputElement>) =>
    setReason(event.target.value)

  const handleCancel = () => onOpenChange(false)

  const handleConfirm = async () => {
    setError(null)

    try {
      await banUser(user.id, reason || undefined)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to ban user")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban this user?</DialogTitle>
          <DialogDescription>
            {user.email} will be signed out and blocked from signing in.
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="ban-reason">Reason (optional)</FieldLabel>
          <Input
            id="ban-reason"
            value={reason}
            onChange={handleReasonChange}
            placeholder="Violation of the rules…"
          />
          {error && <FieldError>{error}</FieldError>}
        </Field>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={isMutating}
          >
            Ban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BanUserDialog
