import { mapPointSummary } from "@lootopia/api/routes/hunts/mappers"
import type { $hunt } from "@lootopia/db/repositories/hunt.repository"

type AdminHuntRow = Awaited<
  ReturnType<ReturnType<typeof $hunt.findAll>["execute"]>
>[number]

export const mapAdminHunt = (hunt: AdminHuntRow) => {
  const playerCount = Number(hunt.playerCount)
  const totalCompletions = Number(hunt.completionCount)
  const completionRate =
    playerCount > 0 && hunt.points.length > 0
      ? Math.round(
          (totalCompletions / (playerCount * hunt.points.length)) * 100,
        )
      : 0

  return {
    ...hunt,
    points: hunt.points.map(mapPointSummary),
    playerCount,
    completionRate,
  }
}
