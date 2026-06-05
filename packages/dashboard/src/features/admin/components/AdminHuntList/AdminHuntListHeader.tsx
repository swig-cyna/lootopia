import { useAdminHuntListContext } from "@lootopia/dashboard/features/admin/components/AdminHuntList/AdminHuntList.context"

const AdminHuntListHeader = () => {
  const { data } = useAdminHuntListContext()
  const { counts } = data

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">All hunts</h1>
        <p className="text-muted-foreground text-sm">
          {counts.all} hunts · {counts.published} live · {counts.draft} draft
        </p>
      </div>
    </div>
  )
}

export default AdminHuntListHeader
