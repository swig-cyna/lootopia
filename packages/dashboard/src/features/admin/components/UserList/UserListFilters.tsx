import { type Role } from "@lootopia/auth/constants"
import { Input } from "@lootopia/dashboard/components/ui/input"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@lootopia/dashboard/components/ui/tabs"
import { useUserListContext } from "@lootopia/dashboard/features/admin/components/UserList/UserList.context"
import {
  ALL_ROLES_TAB,
  ROLE_FILTER_TABS,
} from "@lootopia/dashboard/features/admin/constants"
import { Search } from "lucide-react"
import { type ChangeEvent } from "react"

const UserListFilters = () => {
  const { data } = useUserListContext()
  const { filters, setRole, setSearch } = data

  const handleTabChange = (value: string) => {
    setRole(value === ALL_ROLES_TAB ? undefined : (value as Role))
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearch(event.target.value)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Tabs
        value={filters.role ?? ALL_ROLES_TAB}
        onValueChange={handleTabChange}
      >
        <TabsList>
          {ROLE_FILTER_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search by email…"
          className="w-56 pl-8"
        />
      </div>
    </div>
  )
}

export default UserListFilters
