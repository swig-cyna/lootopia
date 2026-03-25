import authClient from "@lootopia/mobile/features/auth/utils/auth-client"
import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="min-h-svh flex justify-center items-center">
        <img
          className="animate-bounce size-24"
          style={{ animationDuration: "0.8s" }}
          src="/icon.svg"
        />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/signin" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
