import { cn } from "@lootopia/mobile/lib/utils"
import { type LucideIcon, Locate, Map, User } from "lucide-react"
import { Link, Outlet, useLocation } from "react-router"

type TabButtonProps = {
  icon: LucideIcon
  label: string
  to: string
  active: boolean
}

const TabButton = ({ icon: Icon, label, to, active }: TabButtonProps) => (
  <Link
    to={to}
    className="m-1 flex flex-col justify-center items-center aspect-square"
  >
    <Icon
      className={cn(
        "size-8 rounded p-1",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
      )}
    />
    <p
      className={cn(
        "text-xs",
        active
          ? "text-primary-foreground font-medium"
          : "text-muted-foreground",
      )}
    >
      {label}
    </p>
  </Link>
)

const tabs = [
  { icon: Locate, label: "My hunts", to: "/" },
  { icon: Map, label: "Explore", to: "/explore" },
  { icon: User, label: "Account", to: "/account" },
]

const TabsLayout = () => {
  const { pathname } = useLocation()

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 flex p-4">
        <Outlet />
      </div>
      <div className="h-18 flex justify-around w-full bg-muted sticky bottom-0">
        {tabs.map((tab) => (
          <TabButton key={tab.to} {...tab} active={pathname === tab.to} />
        ))}
      </div>
    </div>
  )
}

export default TabsLayout
