import {
  BALLOON_COLORS,
  BALLOON_COUNT,
  BASE_SCORE_PER_BALLOON,
  COUNTDOWN_GO_DURATION_MS,
  COUNTDOWN_START,
  GAME_DURATION_S,
  TIME_BONUS_PER_SECOND,
} from "@lootopia/mobile/features/games/balloons/constants"
import type { Balloon } from "@lootopia/mobile/features/games/balloons/types"
import { useCallback, useEffect, useRef, useState } from "react"

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

type GameState = {
  balloons: Balloon[]
  score: number
  timeLeft: number
  started: boolean
  finished: boolean
  countdown: number | null
}

const INITIAL_GAME_STATE: GameState = {
  balloons: [],
  score: 0,
  timeLeft: GAME_DURATION_S,
  started: false,
  finished: false,
  countdown: null,
}

export const useBalloonGame = () => {
  const [game, setGame] = useState<GameState>(INITIAL_GAME_STATE)

  const timeLeftRef = useRef(GAME_DURATION_S)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const remaining = game.balloons.filter((b) => !b.popped).length

  useEffect(() => {
    if (!game.started || game.finished) {
      return undefined
    }

    intervalRef.current = setInterval(() => {
      setGame((prev) => {
        const next = prev.timeLeft - 1
        timeLeftRef.current = next

        if (next <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }

          return { ...prev, timeLeft: 0, finished: true }
        }

        return { ...prev, timeLeft: next }
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [game.started, game.finished])

  useEffect(() => {
    if (
      game.started &&
      game.balloons.length > 0 &&
      remaining === 0 &&
      !game.finished
    ) {
      setGame((prev) => ({ ...prev, finished: true }))
    }
  }, [remaining, game.started, game.balloons.length, game.finished])

  useEffect(() => {
    if (game.countdown === null) {
      return undefined
    }

    const delay = game.countdown === 0 ? COUNTDOWN_GO_DURATION_MS : 1000

    const timer = setTimeout(() => {
      if (game.countdown === 0) {
        setGame((prev) => ({ ...prev, started: true, countdown: null }))
      } else {
        setGame((prev) => ({
          ...prev,
          countdown: prev.countdown !== null ? prev.countdown - 1 : null,
        }))
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [game.countdown])

  const startGame = useCallback(() => {
    timeLeftRef.current = GAME_DURATION_S
    setGame({
      balloons: generateBalloons(),
      score: 0,
      timeLeft: GAME_DURATION_S,
      started: false,
      finished: false,
      countdown: COUNTDOWN_START,
    })
  }, [])

  const popBalloon = useCallback((id: string) => {
    setGame((prev) => {
      const balloon = prev.balloons.find((b) => b.id === id)

      if (!balloon || balloon.popped) {
        return prev
      }

      return {
        ...prev,
        score:
          prev.score +
          BASE_SCORE_PER_BALLOON +
          timeLeftRef.current * TIME_BONUS_PER_SECOND,
        balloons: prev.balloons.map((b) =>
          b.id === id ? { ...b, popped: true } : b,
        ),
      }
    })
  }, [])

  return {
    balloons: game.balloons,
    score: game.score,
    timeLeft: game.timeLeft,
    started: game.started,
    finished: game.finished,
    remaining,
    countdown: game.countdown,
    startGame,
    popBalloon,
  }
}
