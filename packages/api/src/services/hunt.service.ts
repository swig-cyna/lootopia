import { z } from "@hono/zod-openapi"
import {
  mapHuntDetail,
  mapHuntDetailPlayer,
  mapPointSummary,
} from "@lootopia/api/routes/hunts/mappers"
import {
  type CreateHuntPointInput,
  type UpdateHuntPointInput,
  createHuntSchema,
  finisherRankingSchema,
  rewardStateSchema,
  updateHuntSchema,
  updateHuntStatusSchema,
} from "@lootopia/api/routes/hunts/schema"
import { paginate } from "@lootopia/api/utils/responses"
import { HUNT_GAME_TYPE, HUNT_STATUS } from "@lootopia/common/constants/hunt"
import { $huntParticipation } from "@lootopia/db/repositories/hunt-participation.repository"
import { $huntPointCompletion } from "@lootopia/db/repositories/hunt-point-completion.repository"
import { $huntPoint } from "@lootopia/db/repositories/hunt-point.repository"
import { $huntRewardClaim } from "@lootopia/db/repositories/hunt-reward-claim.repository"
import { $huntReward } from "@lootopia/db/repositories/hunt-reward.repository"
import { $huntStats } from "@lootopia/db/repositories/hunt-stats.repository"
import { $hunt } from "@lootopia/db/repositories/hunt.repository"
import { $quizQuestion } from "@lootopia/db/repositories/quiz-question.repository"
import { paginateQuery } from "@lootopia/db/utils"

type FinisherRanking = z.infer<typeof finisherRankingSchema>
type RewardState = z.infer<typeof rewardStateSchema>
type CreateHuntData = z.infer<typeof createHuntSchema>
type UpdateHuntData = z.infer<typeof updateHuntSchema>
type UpdateHuntStatusData = z.infer<typeof updateHuntStatusSchema>
type PaginationQuery = { page: number; limit: number }
type ListHuntsQuery = PaginationQuery & {
  status?: "draft" | "published"
  search?: string
  sort?: "recent" | "oldest" | "title"
}

const isWithinTopX = (
  rankings: FinisherRanking[],
  participationId: string,
  topX: number,
) => {
  const rank = [...rankings]
    .sort((a, b) => {
      const scoreDiff = Number(b.score ?? 0) - Number(a.score ?? 0)

      if (scoreDiff !== 0) {
        return scoreDiff
      }

      return (a.finishedAt?.getTime() ?? 0) - (b.finishedAt?.getTime() ?? 0)
    })
    .findIndex((ranking) => ranking.participationId === participationId)

  return rank >= 0 && rank < topX
}

const createHuntPoints = async (
  huntId: string,
  points: CreateHuntPointInput[],
) => {
  const huntPoints = await $huntPoint.create(
    points.map((point) => {
      const base = {
        huntId,
        latitude: point.latitude,
        longitude: point.longitude,
        position: point.position,
        gameType: point.game.type,
      }

      if (point.game.type === HUNT_GAME_TYPE.AR) {
        return { ...base, arId: point.game.arId }
      }

      return base
    }),
  )

  const quizQuestions = huntPoints.flatMap((huntPoint, i) => {
    const point = points[i]

    if (point.game.type !== HUNT_GAME_TYPE.QUIZ) {
      return []
    }

    return [
      {
        huntPointId: huntPoint.id,
        question: point.game.quiz.question,
        answers: point.game.quiz.answers,
        correctAnswerIndex: point.game.quiz.correctIndex,
      },
    ]
  })

  if (quizQuestions.length > 0) {
    await $quizQuestion.create(quizQuestions)
  }

  return huntPoints
}

const updateExistingHuntPoint = async (
  point: UpdateHuntPointInput & { id: string },
) => {
  const arId = point.game.type === HUNT_GAME_TYPE.AR ? point.game.arId : null

  await $huntPoint.update(point.id, {
    latitude: point.latitude,
    longitude: point.longitude,
    position: point.position,
    gameType: point.game.type,
    arId,
  })

  if (point.game.type === HUNT_GAME_TYPE.QUIZ) {
    const existing = await $quizQuestion.byHuntPointId(point.id)

    if (existing) {
      await $quizQuestion.update(existing.id, {
        question: point.game.quiz.question,
        answers: point.game.quiz.answers,
        correctAnswerIndex: point.game.quiz.correctIndex,
      })

      return
    }

    await $quizQuestion.create([
      {
        huntPointId: point.id,
        question: point.game.quiz.question,
        answers: point.game.quiz.answers,
        correctAnswerIndex: point.game.quiz.correctIndex,
      },
    ])

    return
  }

  const existing = await $quizQuestion.byHuntPointId(point.id)

  if (existing) {
    await $quizQuestion.delete(existing.id)
  }
}

const syncHuntPoints = async (
  huntId: string,
  points: UpdateHuntPointInput[],
) => {
  const existingPoints = await $huntPoint.byHuntIds([huntId])
  const incomingIds = new Set(
    points.filter((p) => p.id !== undefined).map((p) => p.id!),
  )

  const toDelete = existingPoints.filter((p) => !incomingIds.has(p.id))
  const toUpdate = points.filter(
    (p): p is UpdateHuntPointInput & { id: string } => p.id !== undefined,
  )
  const toCreate = points.filter((p) => p.id === undefined)

  await Promise.all([
    ...toDelete.map((p) => $huntPoint.delete(p.id)),
    ...toUpdate.map(updateExistingHuntPoint),
    toCreate.length > 0
      ? createHuntPoints(huntId, toCreate as CreateHuntPointInput[])
      : undefined,
  ])
}

const resolveRewardState = async (
  hunt: { id: string; reward: RewardState | null; points: { id: string }[] },
  participation: { id: string; userId: string } | undefined,
  completedCount: number,
) => {
  if (!hunt.reward) {
    return null
  }

  const { reward } = hunt
  const base = { topX: reward.topX }

  if (!participation) {
    return { ...base, claimed: false, eligible: false }
  }

  const claim = await $huntRewardClaim.byRewardAndUser(
    reward.id,
    participation.userId,
  )

  if (claim) {
    return {
      ...base,
      claimed: true,
      eligible: false,
      promoCode: reward.promoCode,
    }
  }

  const isFinisher =
    hunt.points.length > 0 && completedCount >= hunt.points.length

  if (!isFinisher) {
    return { ...base, claimed: false, eligible: false }
  }

  const rankings = await $huntStats.finisherRankings(
    hunt.id,
    hunt.points.length,
  )

  return {
    ...base,
    claimed: false,
    eligible: isWithinTopX(rankings, participation.id, reward.topX),
  }
}

export const $$hunt = {
  create: async (organizerId: string, data: CreateHuntData) => {
    const hunt = await $hunt.create({
      title: data.title,
      description: data.description ?? "",
      organizerId,
    })

    await Promise.all([
      createHuntPoints(hunt.id, data.points),
      $huntReward.create({
        huntId: hunt.id,
        promoCode: data.reward.promoCode,
        topX: data.reward.topX,
      }),
    ])

    const huntWithDetails = await $hunt.byIdWithDetails(hunt.id)

    return mapHuntDetail(huntWithDetails!)
  },

  list: async (organizerId: string, query: ListHuntsQuery) => {
    const { page, limit, status, search, sort } = query

    const [{ result: hunts, count }, { published, draft }] = await Promise.all([
      paginateQuery(
        $hunt.byOrganizer(organizerId, { status, search, sort }),
        { pageSize: limit, pageIndex: page - 1 },
        "id",
      ),
      $hunt.countByStatusForOrganizer(organizerId),
    ])

    const publishedCount = Number(published)
    const draftCount = Number(draft)

    const data = hunts.map((hunt) => {
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
    })

    return {
      ...paginate(data, Number(count), page, limit),
      counts: {
        all: publishedCount + draftCount,
        published: publishedCount,
        draft: draftCount,
      },
    }
  },

  getById: async (huntId: string) => {
    const hunt = await $hunt.byIdWithDetails(huntId)

    if (!hunt) {
      return null
    }

    return mapHuntDetail(hunt)
  },

  update: async (huntId: string, data: UpdateHuntData) => {
    const hunt = await $hunt.update(huntId, {
      title: data.title,
      description: data.description,
    })

    if (!hunt) {
      return null
    }

    await Promise.all([
      syncHuntPoints(hunt.id, data.points),
      $huntReward.update(data.reward.id, {
        topX: data.reward.topX,
        promoCode: data.reward.promoCode,
      }),
    ])

    const huntWithDetails = await $hunt.byIdWithDetails(hunt.id)

    if (!huntWithDetails?.reward) {
      return null
    }

    return mapHuntDetail(huntWithDetails)
  },

  delete: async (huntId: string) => {
    await $hunt.delete(huntId)
  },

  updateStatus: async (huntId: string, data: UpdateHuntStatusData) => {
    const hunt = await $hunt.update(huntId, { status: data.status })

    if (!hunt) {
      return null
    }

    const huntWithDetails = await $hunt.byIdWithDetails(hunt.id)

    if (!huntWithDetails?.reward) {
      return null
    }

    return mapHuntDetail(huntWithDetails)
  },

  listPublished: async (userId: string, query: PaginationQuery) => {
    const { page, limit } = query

    const { result: hunts, count } = await paginateQuery(
      $hunt.findPublished(userId),
      { pageSize: limit, pageIndex: page - 1 },
      "id",
    )

    const data = hunts.map(({ reward: _reward, participation, ...hunt }) => ({
      ...hunt,
      points: hunt.points.map(mapPointSummary),
      isJoined: participation !== null,
    }))

    return paginate(data, Number(count), page, limit)
  },

  listMyHunts: async (userId: string, query: PaginationQuery) => {
    const { page, limit } = query

    const { result: hunts, count } = await paginateQuery(
      $hunt.byJoinedByUser(userId),
      { pageSize: limit, pageIndex: page - 1 },
      "hunts.id",
    )

    const data = hunts.map(({ reward: _reward, ...hunt }) => ({
      ...hunt,
      points: hunt.points.map(mapPointSummary),
    }))

    return paginate(data, Number(count), page, limit)
  },

  getPublished: async (userId: string, huntId: string) => {
    const [huntWithDetails, participation] = await Promise.all([
      $hunt.byIdWithDetails(huntId),
      $huntParticipation.byUserAndHunt(userId, huntId),
    ])

    if (!huntWithDetails || huntWithDetails.status !== HUNT_STATUS.PUBLISHED) {
      return null
    }

    const completions = participation
      ? await $huntPointCompletion.byParticipationId(participation.id).execute()
      : []

    const reward = await resolveRewardState(
      huntWithDetails,
      participation,
      completions.length,
    )

    return {
      ...mapHuntDetailPlayer(huntWithDetails),
      completedPointIds: completions.map((c) => c.huntPointId),
      totalScore: completions.reduce((sum, c) => sum + c.score, 0),
      isJoined: Boolean(participation),
      reward,
    }
  },

  join: async (userId: string, huntId: string) => {
    const hunt = await $hunt.byId(huntId)

    if (!hunt || hunt.status !== HUNT_STATUS.PUBLISHED) {
      return "not_found" as const
    }

    const existing = await $huntParticipation.byUserAndHunt(userId, huntId)

    if (existing) {
      return "already_joined" as const
    }

    return $huntParticipation.create({ huntId, userId })
  },

  claimReward: async (userId: string, huntId: string) => {
    const hunt = await $hunt.byIdWithDetails(huntId)

    if (!hunt || hunt.status !== HUNT_STATUS.PUBLISHED || !hunt.reward) {
      return "not_found" as const
    }

    const participation = await $huntParticipation.byUserAndHunt(userId, huntId)

    if (!participation) {
      return "not_finished" as const
    }

    const existing = await $huntRewardClaim.byRewardAndUser(
      hunt.reward.id,
      userId,
    )

    if (existing) {
      return "already_claimed" as const
    }

    const completions = await $huntPointCompletion
      .byParticipationId(participation.id)
      .execute()

    const isFinisher =
      hunt.points.length > 0 && completions.length >= hunt.points.length

    if (!isFinisher) {
      return "not_finished" as const
    }

    const rankings = await $huntStats.finisherRankings(
      hunt.id,
      hunt.points.length,
    )

    if (!isWithinTopX(rankings, participation.id, hunt.reward.topX)) {
      return "not_eligible" as const
    }

    await $huntRewardClaim.create({
      huntRewardId: hunt.reward.id,
      userId,
    })

    return { promoCode: hunt.reward.promoCode } as const
  },
}
