import { Button } from "@lootopia/dashboard/components/ui/button"
import { useHuntListContext } from "@lootopia/dashboard/features/hunt/components/HuntList/HuntList.context"
import { Plus } from "lucide-react"

const HuntListHeader = () => {
  const { data } = useHuntListContext()
  const { counts, goToCreate } = data

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">My hunts</h1>
        <p className="text-muted-foreground text-sm">
          {counts.all} hunts · {counts.published} live · {counts.draft} draft
        </p>
      </div>

      <Button onClick={goToCreate}>
        <Plus />
        New hunt
      </Button>
    </div>
  )
}

export default HuntListHeader
