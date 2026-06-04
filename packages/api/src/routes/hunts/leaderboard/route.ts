import { createRouter, type AuthenticatedContext } from "@lootopia/api/lib/hono"
import { getLeaderboardController } from "@lootopia/api/routes/hunts/leaderboard/controller"
import { getLeaderboardRoute } from "@lootopia/api/routes/hunts/leaderboard/doc"

const leaderboardRouter = createRouter<AuthenticatedContext>().openapi(
  getLeaderboardRoute,
  getLeaderboardController,
)

export default leaderboardRouter
