import {
  HUNT_STATUS,
  type HuntSort,
  type HuntStatus,
} from "@lootopia/common/constants/hunt"
import { Button } from "@lootopia/dashboard/components/ui/button"
import { Input } from "@lootopia/dashboard/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lootopia/dashboard/components/ui/popover"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@lootopia/dashboard/components/ui/tabs"
import { useHuntListContext } from "@lootopia/dashboard/features/hunt/components/HuntList/HuntList.context"
import { HUNT_SORT_OPTIONS } from "@lootopia/dashboard/features/hunt/utils/constants"
import { ArrowUpDown, Check, Search } from "lucide-react"
import { useState, type ChangeEvent } from "react"

const ALL_TAB = "all"

const HuntListFilters = () => {
  const { data } = useHuntListContext()
  const { filters, setStatus, setSearch, setSort } = data

  const [isSortOpen, setIsSortOpen] = useState(false)

  const statusTabs = [
    { value: ALL_TAB, label: "All" },
    { value: HUNT_STATUS.PUBLISHED, label: "Live" },
    { value: HUNT_STATUS.DRAFT, label: "Drafts" },
  ]

  const activeSortLabel = HUNT_SORT_OPTIONS.find(
    (option) => option.value === filters.sort,
  )?.label

  const handleTabChange = (value: string) => {
    setStatus(value === ALL_TAB ? undefined : (value as HuntStatus))
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearch(event.target.value)

  const handleSelectSort = (sort: HuntSort) => () => {
    setSort(sort)
    setIsSortOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Tabs value={filters.status ?? ALL_TAB} onValueChange={handleTabChange}>
        <TabsList>
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search…"
            className="w-56 pl-8"
          />
        </div>

        <Popover open={isSortOpen} onOpenChange={setIsSortOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <ArrowUpDown />
              Sort: {activeSortLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-1">
            {HUNT_SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={handleSelectSort(option.value)}
                className="hover:bg-muted flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm"
              >
                {option.label}
                {option.value === filters.sort && <Check className="size-4" />}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default HuntListFilters
