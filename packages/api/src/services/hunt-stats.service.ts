import { HUNT_STATUS } from "@lootopia/common/constants/hunt"
import { $huntRewardClaim } from "@lootopia/db/repositories/hunt-reward-claim.repository"
import { $huntStats } from "@lootopia/db/repositories/hunt-stats.repository"
import { $hunt } from "@lootopia/db/repositories/hunt.repository"

const TOP_HUNTS_LIMIT = 5

const percentage = (part: number, total: number) =>
  total > 0 ? Math.round((part / total) * 100) : 0

const countFromRows = (
  rows: { huntId: string; count: number }[],
  huntId: string,
) => Number(rows.find((row) => row.huntId === huntId)?.count ?? 0)

export const $$huntStats = {
  getHuntStats: async (huntId: string) => {
    const hunt = await $hunt.byIdWithDetails(huntId)

    if (!hunt) {
      return null
    }

    const [
      participants,
      finisherRows,
      claimRows,
      pointFunnel,
      registrations,
      averageScore,
    ] = await Promise.all([
      $huntStats.participantCount(huntId),
      $huntStats.finisherCountsByHuntIds([huntId]),
      $huntRewardClaim.countByHuntIds([huntId]),
      $huntStats.pointFunnel(huntId),
      $huntStats.registrationsByDay([huntId]),
      $huntStats.avgScore(huntId),
    ])

    const finishers = countFromRows(finisherRows, huntId)

    return {
      huntId: hunt.id,
      title: hunt.title,
      status: hunt.status,
      participants,
      finishers,
      completionRate: percentage(finishers, participants),
      averageScore,
      rewardsClaimed: countFromRows(claimRows, huntId),
      rewardTopX: hunt.reward?.topX ?? null,
      pointFunnel: pointFunnel.map((point) => ({
        pointId: point.pointId,
        position: point.position,
        gameType: point.gameType,
        completions: Number(point.completions),
      })),
      registrations: registrations.map((entry) => ({
        day: entry.day,
        count: Number(entry.count),
      })),
    }
  },

  getOrganizerStats: async (organizerId: string) => {
    const summaries = await $huntStats.huntSummariesByOrganizer(organizerId)
    const huntIds = summaries.map((summary) => summary.huntId)

    const [finisherRows, claimRows, registrations] = await Promise.all([
      $huntStats.finisherCountsByHuntIds(huntIds),
      $huntRewardClaim.countByHuntIds(huntIds),
      $huntStats.registrationsByDay(huntIds),
    ])

    const hunts = summaries.map((summary) => {
      const participants = Number(summary.participantCount)
      const finishers = countFromRows(finisherRows, summary.huntId)

      return {
        huntId: summary.huntId,
        title: summary.title,
        status: summary.status,
        participants,
        finishers,
        completionRate: percentage(finishers, participants),
      }
    })

    const totalParticipants = hunts.reduce((sum, h) => sum + h.participants, 0)
    const totalFinishers = hunts.reduce((sum, h) => sum + h.finishers, 0)
    const totalRewardsClaimed = claimRows.reduce(
      (sum, row) => sum + Number(row.count),
      0,
    )
    const publishedHunts = hunts.filter(
      (h) => h.status === HUNT_STATUS.PUBLISHED,
    ).length

    const topHunts = [...hunts]
      .sort((a, b) => b.participants - a.participants)
      .slice(0, TOP_HUNTS_LIMIT)
      .map(({ huntId, title, participants, finishers, completionRate }) => ({
        huntId,
        title,
        participants,
        finishers,
        completionRate,
      }))

    return {
      totalHunts: hunts.length,
      publishedHunts,
      draftHunts: hunts.length - publishedHunts,
      totalParticipants,
      totalFinishers,
      completionRate: percentage(totalFinishers, totalParticipants),
      totalRewardsClaimed,
      registrations: registrations.map((entry) => ({
        day: entry.day,
        count: Number(entry.count),
      })),
      topHunts,
    }
  },
}
