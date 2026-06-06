import CreateUserDialog from "@lootopia/dashboard/features/admin/components/UserList/CreateUserDialog"
import { useUserListContext } from "@lootopia/dashboard/features/admin/components/UserList/UserList.context"

const UserListHeader = () => {
  const { data } = useUserListContext()
  const { total } = data

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-muted-foreground text-sm">{total} users</p>
      </div>

      <CreateUserDialog />
    </div>
  )
}

export default UserListHeader
