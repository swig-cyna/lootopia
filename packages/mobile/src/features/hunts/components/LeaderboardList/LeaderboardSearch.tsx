import { Input } from "@lootopia/mobile/components/ui/input"
import { useLeaderboardList } from "@lootopia/mobile/features/hunts/components/LeaderboardList/LeaderboardList.context"
import { Search } from "lucide-react"
import type { ChangeEvent } from "react"

const LeaderboardSearch = () => {
  const { data } = useLeaderboardList()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    data.handleSearchChange(e.target.value)
  }

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        placeholder="Search a player..."
        value={data.search}
        onChange={handleChange}
        className="py-5 pl-9"
      />
    </div>
  )
}

export default LeaderboardSearch
