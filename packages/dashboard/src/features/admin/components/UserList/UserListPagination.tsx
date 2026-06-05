import { Button } from "@lootopia/dashboard/components/ui/button"
import { useUserListContext } from "@lootopia/dashboard/features/admin/components/UserList/UserList.context"
import { ChevronLeft, ChevronRight } from "lucide-react"

const UserListPagination = () => {
  const { data } = useUserListContext()
  const { metadata, setPage } = data

  if (metadata.totalPages <= 1) {
    return null
  }

  const handlePrev = () => setPage(metadata.page - 1)
  const handleNext = () => setPage(metadata.page + 1)

  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-muted-foreground text-sm">
        Page {metadata.page} of {metadata.totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrev}
        disabled={!metadata.hasPrev}
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={!metadata.hasNext}
      >
        <ChevronRight />
      </Button>
    </div>
  )
}

export default UserListPagination
