import { useHuntMap } from "@lootopia/mobile/features/map/context/HuntMapContext"
import { getDistance } from "@lootopia/mobile/features/map/utils/distance"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

const VALIDATION_RADIUS_M = 10

export type HuntPoint = {
  id: string
  longitude: number
  latitude: number
  position: number
  gameType: "quiz" | "ar"
  quizQuestion?: {
    question: string
    answers: string[]
    correctAnswerIndex: number
  }
}

type HuntSessionContextValue = {
  points: HuntPoint[]
  setPoints: (_points: HuntPoint[]) => void
  sortedPoints: HuntPoint[]
  completedIds: Set<string>
  nextPoint: HuntPoint | null
  activePoint: HuntPoint | null
  validatePoint: () => void
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
  const [activePoint, setActivePoint] = useState<HuntPoint | null>(null)

  const sortedPoints = [...points].sort((a, b) => a.position - b.position)
  const nextPoint = sortedPoints.find((p) => !completedIds.has(p.id)) ?? null

  useEffect(() => {
    if (!userPosition || !nextPoint || activePoint) {
      return
    }

    const distance = getDistance(userPosition, [nextPoint.longitude, nextPoint.latitude])

    if (distance <= VALIDATION_RADIUS_M) {
      setActivePoint(nextPoint)
    }
  }, [userPosition, nextPoint?.id])

  const validatePoint = () => {
    if (!activePoint) {
      return
    }

    setCompletedIds((prev) => new Set([...prev, activePoint.id]))
    setActivePoint(null)
  }

  return (
    <HuntSessionContext.Provider
      value={{
        points,
        setPoints,
        sortedPoints,
        completedIds,
        nextPoint,
        activePoint,
        validatePoint,
      }}
    >
      {children}
    </HuntSessionContext.Provider>
  )
}
