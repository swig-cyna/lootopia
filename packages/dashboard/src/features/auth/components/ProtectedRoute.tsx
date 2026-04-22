import authClient from "@lootopia/dashboard/features/auth/utils/auth-client"
import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return null
  }

  if (!session) {
    return <Navigate to="/signin" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
