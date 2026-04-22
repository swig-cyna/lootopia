import AppSidebarHeader from "@lootopia/dashboard/components/SidebarHeader"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "@lootopia/dashboard/components/ui/sidebar"
import NavUser from "@lootopia/dashboard/components/NavUser"

export function AppSidebar() {
  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
