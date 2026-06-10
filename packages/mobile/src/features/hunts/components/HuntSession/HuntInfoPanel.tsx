import HuntNextPointPanel from "@lootopia/mobile/features/hunts/components/HuntSession/HuntNextPointPanel"
import HuntProgressBar from "@lootopia/mobile/features/hunts/components/HuntSession/HuntPointsList"
import HuntRewardPanel from "@lootopia/mobile/features/hunts/components/HuntSession/HuntRewardPanel"
import { useHuntSession } from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import { ChevronRight, Trophy } from "lucide-react"
import { useNavigate, useParams } from "react-router"

const HuntInfoPanel = () => {
  const { sortedPoints, nextPoint, completedIds, totalScore } = useHuntSession()
  const { id: huntId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const handleLeaderboard = () => navigate(`/hunts/${huntId}/leaderboard`)

  return (
    <div className="bg-background border-border flex flex-col gap-3 border-t px-4 pt-4 pb-6">
      {nextPoint ? (
        <HuntNextPointPanel />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="bg-muted rounded-xl p-3 text-center">
            <p className="text-primary text-sm font-medium">Hunt complete!</p>
          </div>

          <HuntRewardPanel />

          <button
            onClick={handleLeaderboard}
            className="flex w-full items-center justify-between rounded-xl border px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <Trophy className="text-primary size-4" />
              <span className="text-sm font-medium">See leaderboard</span>
            </div>
            <ChevronRight className="text-muted-foreground size-4" />
          </button>
        </div>
      )}

      <HuntProgressBar
        total={sortedPoints.length}
        completed={completedIds.size}
        totalScore={totalScore}
      />
    </div>
  )
}

export default HuntInfoPanel
