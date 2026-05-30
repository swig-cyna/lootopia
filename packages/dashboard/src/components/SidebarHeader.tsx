import { SidebarHeader } from "@lootopia/dashboard/components/ui/sidebar"
import { Link } from "react-router"

const AppSidebarHeader = () => (
  <SidebarHeader className="px-4 py-4">
    <Link to="/">
      <img
        src="/logo.svg"
        alt="Lootopia"
        className="h-8 group-data-[collapsible=icon]:hidden"
      />
    </Link>
  </SidebarHeader>
)

export default AppSidebarHeader
