import { AppSidebar } from "@lootopia/dashboard/components/Sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@lootopia/dashboard/components/ui/sidebar"
import { Outlet } from "react-router"

const DashboardLayout = () => (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-12 items-center px-4 border-b">
        <SidebarTrigger />
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </SidebarInset>
  </SidebarProvider>
)

export default DashboardLayout
