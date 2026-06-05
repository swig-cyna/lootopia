import { ROLES } from "@lootopia/auth/constants"
import AppSidebarHeader from "@lootopia/dashboard/components/SidebarHeader"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@lootopia/dashboard/components/ui/sidebar"
import NavUser from "@lootopia/dashboard/components/NavUser"
import authClient from "@lootopia/dashboard/features/auth/utils/auth-client"
import {
  LayoutDashboard,
  type LucideIcon,
  Map,
  Shield,
  Users,
} from "lucide-react"
import { NavLink } from "react-router"

type NavItem = { label: string; href: string; icon: LucideIcon }

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Hunts", href: "/hunt", icon: Map },
]

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Hunts", href: "/admin/hunts", icon: Shield },
]

const NavItems = ({ items }: { items: NavItem[] }) => (
  <SidebarMenu>
    {items.map(({ label, href, icon: Icon }) => (
      <SidebarMenuItem key={href}>
        <NavLink to={href} end>
          {({ isActive }) => (
            <SidebarMenuButton isActive={isActive}>
              <Icon />
              <span>{label}</span>
            </SidebarMenuButton>
          )}
        </NavLink>
      </SidebarMenuItem>
    ))}
  </SidebarMenu>
)

export function AppSidebar() {
  const { data: session } = authClient.useSession()

  const isAdmin = session?.user.role === ROLES.ADMIN

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <NavItems items={NAV_ITEMS} />
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <NavItems items={ADMIN_NAV_ITEMS} />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
