import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lootopia/dashboard/components/ui/popover"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@lootopia/dashboard/components/ui/sidebar"
import authClient from "@lootopia/dashboard/features/auth/utils/auth-client"
import { ChevronsUpDown, LogOut, UserIcon } from "lucide-react"

const NavUser = () => {
  const { data: session } = authClient.useSession()

  const user = session?.user

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover>
          <PopoverTrigger asChild>
            <SidebarMenuButton size="lg" className="gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
                <UserIcon className="size-4" />
              </span>
              <span className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">
                  {user?.name ?? "—"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email ?? "—"}
                </span>
              </span>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </PopoverTrigger>

          <PopoverContent side="top" align="start" className="w-60 p-1">
            <button
              onClick={() => authClient.signOut()}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default NavUser
