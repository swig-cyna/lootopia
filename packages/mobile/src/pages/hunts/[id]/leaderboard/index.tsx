import LeaderboardList from "@lootopia/mobile/features/hunts/components/LeaderboardList"
import { LeaderboardListProvider } from "@lootopia/mobile/features/hunts/components/LeaderboardList/LeaderboardList.context"
import LeaderboardMyRank from "@lootopia/mobile/features/hunts/components/LeaderboardList/LeaderboardMyRank"
import { useLeaderboard } from "@lootopia/mobile/features/hunts/hooks/useLeaderboard"
import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router"

const LeaderboardPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const leaderboard = useLeaderboard(id!)

  const handleGoBack = () => navigate(-1)

  return (
    <LeaderboardListProvider data={leaderboard}>
      <div className="flex h-svh flex-col">
        <div className="flex items-center gap-3 px-4 pt-5">
          <button
            onClick={handleGoBack}
            className="rounded-full p-1.5 transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <ArrowLeft className="size-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold">Leaderboard</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <LeaderboardList />
        </div>

        <LeaderboardMyRank />
      </div>
    </LeaderboardListProvider>
  )
}

export default LeaderboardPage
