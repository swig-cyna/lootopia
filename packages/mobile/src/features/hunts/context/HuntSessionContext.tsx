import { useHuntMap } from "@lootopia/mobile/features/map/context/HuntMapContext"
import { getDistance } from "@lootopia/mobile/features/map/utils/distance"
import { api } from "@lootopia/mobile/lib/api"
import type { InferResponseType } from "hono/client"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

const VALIDATION_RADIUS_M = 10

type HuntApiResponse = InferResponseType<
  (typeof api.hunts.published)[":id"]["$get"],
  200
>
export type HuntPoint = HuntApiResponse["points"][number]
export type QuizQuestion = NonNullable<HuntPoint["quizQuestion"]>

type HuntSessionContextValue = {
  sortedPoints: HuntPoint[]
  completedIds: Set<string>
  totalScore: number
  nextPoint: HuntPoint | null
  activePoint: HuntPoint | null
  validatePoint: (_score: number) => void
  setHuntData: (
    _points: HuntPoint[],
    _completedPointIds: string[],
    _totalScore: number,
  ) => void
}

const HuntSessionContext = createContext<HuntSessionContextValue | null>(null)

export const useHuntSession = () => {
  const ctx = useContext(HuntSessionContext)

  if (!ctx) {
    throw new Error("useHuntSession must be used inside HuntSessionProvider")
  }

  return ctx
}

export const HuntSessionProvider = ({ children }: { children: ReactNode }) => {
  const { userPosition } = useHuntMap()

  const [points, setPoints] = useState<HuntPoint[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [totalScore, setTotalScore] = useState(0)
  const [activePoint, setActivePoint] = useState<HuntPoint | null>(null)

  const sortedPoints = [...points].sort((a, b) => a.position - b.position)
  const nextPoint = sortedPoints.find((p) => !completedIds.has(p.id)) ?? null

  useEffect(() => {
    if (!userPosition || !nextPoint || activePoint) {
      return
    }

    const distance = getDistance(userPosition, [
      nextPoint.longitude,
      nextPoint.latitude,
    ])

    if (distance <= VALIDATION_RADIUS_M) {
      setActivePoint(nextPoint)
    }
  }, [userPosition, nextPoint?.id])

  const setHuntData = (
    newPoints: HuntPoint[],
    completedPointIds: string[],
    initialTotalScore: number,
  ) => {
    setPoints(newPoints)
    setCompletedIds(new Set(completedPointIds))
    setTotalScore(initialTotalScore)
  }

  const validatePoint = (score: number) => {
    if (!activePoint) {
      return
    }

    setCompletedIds((prev) => new Set([...prev, activePoint.id]))
    setTotalScore((prev) => prev + score)
    setActivePoint(null)
  }

  return (
    <HuntSessionContext.Provider
      value={{
        sortedPoints,
        completedIds,
        totalScore,
        nextPoint,
        activePoint,
        validatePoint,
        setHuntData,
      }}
    >
      {children}
    </HuntSessionContext.Provider>
  )
}
