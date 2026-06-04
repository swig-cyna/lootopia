import LeaderboardEntries from "@lootopia/mobile/features/hunts/components/LeaderboardList/LeaderboardEntries"
import LeaderboardSearch from "@lootopia/mobile/features/hunts/components/LeaderboardList/LeaderboardSearch"

const LeaderboardList = () => (
  <div className="flex flex-col gap-3">
    <LeaderboardSearch />
    <LeaderboardEntries />
  </div>
)

export default LeaderboardList
