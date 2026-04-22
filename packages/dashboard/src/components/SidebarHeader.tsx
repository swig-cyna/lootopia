import { SidebarHeader } from "@lootopia/dashboard/components/ui/sidebar"

const AppSidebarHeader = () => (
  <SidebarHeader className="px-4 py-3">
    <img
      src="/logo.svg"
      alt="Lootopia"
      className="h-8 group-data-[collapsible=icon]:hidden"
    />
  </SidebarHeader>
)

export default AppSidebarHeader
