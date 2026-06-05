import { AdminHuntListProvider } from "@lootopia/dashboard/features/admin/components/AdminHuntList/AdminHuntList.context"
import AdminHuntListFilters from "@lootopia/dashboard/features/admin/components/AdminHuntList/AdminHuntListFilters"
import AdminHuntListHeader from "@lootopia/dashboard/features/admin/components/AdminHuntList/AdminHuntListHeader"
import AdminHuntListPagination from "@lootopia/dashboard/features/admin/components/AdminHuntList/AdminHuntListPagination"
import AdminHuntListTable from "@lootopia/dashboard/features/admin/components/AdminHuntList/AdminHuntListTable"
import { useAdminHunts } from "@lootopia/dashboard/features/admin/hooks/useAdminHunts"

const AdminHuntList = () => {
  const data = useAdminHunts()

  return (
    <AdminHuntListProvider data={data}>
      <div className="mx-auto flex h-full w-full flex-col gap-4">
        <AdminHuntListHeader />
        <AdminHuntListFilters />
        <AdminHuntListTable />
        <AdminHuntListPagination />
      </div>
    </AdminHuntListProvider>
  )
}

export default AdminHuntList
