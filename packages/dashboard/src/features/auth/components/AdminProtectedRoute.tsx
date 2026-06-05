import { ROLES } from "@lootopia/auth/constants"
import authClient from "@lootopia/dashboard/features/auth/utils/auth-client"
import { Navigate, Outlet } from "react-router"

const AdminProtectedRoute = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return null
  }

  if (session?.user.role !== ROLES.ADMIN) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminProtectedRoute
