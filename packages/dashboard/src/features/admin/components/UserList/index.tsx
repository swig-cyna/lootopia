import { UserListProvider } from "@lootopia/dashboard/features/admin/components/UserList/UserList.context"
import UserListFilters from "@lootopia/dashboard/features/admin/components/UserList/UserListFilters"
import UserListHeader from "@lootopia/dashboard/features/admin/components/UserList/UserListHeader"
import UserListPagination from "@lootopia/dashboard/features/admin/components/UserList/UserListPagination"
import UserListTable from "@lootopia/dashboard/features/admin/components/UserList/UserListTable"
import { useAdminUsers } from "@lootopia/dashboard/features/admin/hooks/useAdminUsers"

const UserList = () => {
  const data = useAdminUsers()

  return (
    <UserListProvider data={data}>
      <div className="mx-auto flex h-full w-full flex-col gap-4">
        <UserListHeader />
        <UserListFilters />
        <UserListTable />
        <UserListPagination />
      </div>
    </UserListProvider>
  )
}

export default UserList
