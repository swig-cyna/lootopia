import { AppSidebar } from "@lootopia/dashboard/components/Sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@lootopia/dashboard/components/ui/sidebar"
import { Outlet } from "react-router"

const DashboardLayout = () => (
  <SidebarProvider className="h-svh overflow-hidden">
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-12 shrink-0 items-center border-b px-4">
        <SidebarTrigger />
      </header>
      <main className="flex min-h-0 flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </SidebarInset>
  </SidebarProvider>
)

export default DashboardLayout
