import { Outlet } from "react-router"

const AppLayout = () => (
  <main className="mx-auto flex min-h-svh max-w-lg flex-1 flex-col">
    <Outlet />
  </main>
)

export default AppLayout
