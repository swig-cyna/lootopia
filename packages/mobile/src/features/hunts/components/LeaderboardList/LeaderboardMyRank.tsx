import { useLeaderboardList } from "@lootopia/mobile/features/hunts/components/LeaderboardList/LeaderboardList.context"

const LeaderboardMyRank = () => {
  const { data } = useLeaderboardList()

  if (!data.myRank || data.isMyEntryVisible) {
    return null
  }

  return (
    <div className="bg-background px-4 py-3">
      <div className="bg-muted border-border flex items-center gap-3 rounded-xl border px-3 py-2.5">
        <span className="text-muted-foreground w-6 text-center text-sm font-bold">
          #{data.myRank.rank}
        </span>
        <span className="flex-1 text-sm font-medium">You</span>
        <div className="flex flex-col items-end">
          <span className="text-foreground text-sm font-semibold">
            {data.myRank.totalScore} pts
          </span>
          <span className="text-muted-foreground text-xs">
            {data.myRank.completedPoints} points
          </span>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardMyRank
