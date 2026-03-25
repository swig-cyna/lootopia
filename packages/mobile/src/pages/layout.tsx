import { Outlet } from "react-router"

const AppLayout = () => (
  <main className="flex flex-col flex-1 min-h-svh max-w-lg mx-auto">
    <Outlet />
  </main>
)

export default AppLayout
