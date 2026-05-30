import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lootopia/dashboard/components/ui/dialog"

type HuntPointsListDeleteDialogProps = {
  open: boolean
  position: number
  onClose: () => void
  onConfirm: () => void
}

const HuntPointsListDeleteDialog = ({
  open,
  position,
  onClose,
  onConfirm,
}: HuntPointsListDeleteDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this point?</DialogTitle>
        <DialogDescription>
          <strong>Point #{position}</strong> will be permanently removed from
          the hunt. This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default HuntPointsListDeleteDialog
