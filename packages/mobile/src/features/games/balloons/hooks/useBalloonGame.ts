import { useCallback, useEffect, useRef, useState } from "react"
import {
  BALLOON_COLORS,
  BALLOON_COUNT,
  BASE_SCORE_PER_BALLOON,
  COUNTDOWN_GO_DURATION_MS,
  COUNTDOWN_START,
  GAME_DURATION_S,
  TIME_BONUS_PER_SECOND,
} from "../constants"
import type { Balloon } from "../types"

const generateBalloons = (): Balloon[] =>
  Array.from({ length: BALLOON_COUNT }, (_, i) => {
    const angle = (i / BALLOON_COUNT) * Math.PI * 2
    const radius = 1.5 + Math.random() * 1.5
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius - 2
    const y = 0.8 + Math.random() * 1.5

    return {
      id: crypto.randomUUID(),
      position: [x, y, z] as [number, number, number],
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      scale: 0.8 + Math.random() * 0.4,
      popped: false,
    }
  })

export const useBalloonGame = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  const timeLeftRef = useRef(GAME_DURATION_S)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const remaining = balloons.filter((b) => !b.popped).length

  useEffect(() => {
    if (!started || finished) {
      return undefined
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1
        timeLeftRef.current = next

        if (next <= 0) {
          setFinished(true)

          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }

          return 0
        }

        return next
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [started, finished])

  useEffect(() => {
    if (started && balloons.length > 0 && remaining === 0 && !finished) {
      setFinished(true)
    }
  }, [remaining, started, balloons.length, finished])

  useEffect(() => {
    if (countdown === null) {
      return undefined
    }

    const delay = countdown === 0 ? COUNTDOWN_GO_DURATION_MS : 1000

    const timer = setTimeout(() => {
      if (countdown === 0) {
        setStarted(true)
        setCountdown(null)
      } else {
        setCountdown((prev) => (prev !== null ? prev - 1 : null))
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [countdown])

  const startGame = useCallback(() => {
    setBalloons(generateBalloons())
    setScore(0)
    setTimeLeft(GAME_DURATION_S)
    timeLeftRef.current = GAME_DURATION_S
    setStarted(false)
    setFinished(false)
    setCountdown(COUNTDOWN_START)
  }, [])

  const popBalloon = useCallback((id: string) => {
    setBalloons((prev) => {
      const balloon = prev.find((b) => b.id === id)

      if (!balloon || balloon.popped) {
        return prev
      }

      setScore(
        (s) =>
          s +
          BASE_SCORE_PER_BALLOON +
          timeLeftRef.current * TIME_BONUS_PER_SECOND,
      )

      return prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    })
  }, [])

  return {
    balloons,
    score,
    timeLeft,
    started,
    finished,
    remaining,
    countdown,
    startGame,
    popBalloon,
  }
}
