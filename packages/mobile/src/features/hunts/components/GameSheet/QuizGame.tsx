import { HUNT_GAME_TYPE } from "@lootopia/common/constants/hunt"
import { Button } from "@lootopia/mobile/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@lootopia/mobile/components/ui/empty"
import type { HuntPoint } from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import { api, useMutation } from "@lootopia/mobile/lib/api"
import { cn } from "@lootopia/mobile/lib/utils"
import { CheckCircle, Timer, XCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const BASE_SCORE = 1000
const SCORE_DECAY_PER_SECOND = 10

type QuizState = {
  started: boolean
  selected: number | null
  isCorrect: boolean | null
  elapsed: number
  earnedScore: number
}

type QuizGameProps = {
  point: HuntPoint
  onValidate: (_score: number) => void
}

const answerState = (
  i: number,
  selected: number | null,
  isCorrect: boolean | null,
) => {
  if (isCorrect === null) {
    return selected === i ? "selected" : "idle"
  }

  if (isCorrect && i === selected) {
    return "correct"
  }

  if (!isCorrect && i === selected) {
    return "wrong"
  }

  return "idle"
}

const ANSWER_STYLES: Record<string, string> = {
  idle: "border-border bg-muted text-foreground",
  selected: "border-primary bg-primary/10",
  correct: "border-green-500 bg-green-50 text-green-700",
  wrong: "border-destructive bg-destructive/10 text-destructive",
}

const formatElapsed = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

const QuizGame = ({ point, onValidate }: QuizGameProps) => {
  const [state, setState] = useState<QuizState>({
    started: false,
    selected: null,
    isCorrect: null,
    elapsed: 0,
    earnedScore: 0,
  })

  const startRef = useRef<number | null>(null)

  const [validatePoint, { isPending }] = useMutation(
    api.hunts.points[":id"].validate.$post,
  )

  useEffect(() => {
    if (!state.started) {
      return undefined
    }

    startRef.current = Date.now()

    const interval = setInterval(() => {
      setState((prev) => ({ ...prev, elapsed: Date.now() - startRef.current! }))
    }, 1000)

    return () => clearInterval(interval)
  }, [state.started])

  if (point.game.type !== HUNT_GAME_TYPE.QUIZ) {
    return null
  }

  const { quiz } = point.game

  const handleStart = () => {
    setState((prev) => ({ ...prev, started: true }))
  }

  const handleSelect = (i: number) => () => {
    setState((prev) => ({ ...prev, selected: i }))
  }

  const handleContinue = () => onValidate(state.earnedScore)

  const handleSubmit = async () => {
    if (state.selected === null || startRef.current === null) {
      return
    }

    const elapsedSeconds = Math.floor((Date.now() - startRef.current) / 1000)
    const score = Math.max(
      0,
      BASE_SCORE - elapsedSeconds * SCORE_DECAY_PER_SECOND,
    )

    const result = await validatePoint({
      param: { id: point.id },
      json: { gameType: "quiz", selectedAnswerIndex: state.selected, score },
    })

    setState((prev) => ({
      ...prev,
      earnedScore: result.isCorrect ? score : 0,
      isCorrect: result.isCorrect,
    }))
  }

  const submitted = state.isCorrect !== null

  if (!state.started) {
    return (
      <Empty className="border-0 p-0">
        <EmptyHeader>
          <EmptyMedia>
            <Timer className="text-primary size-10" />
          </EmptyMedia>
          <EmptyTitle>This quiz is timed</EmptyTitle>
          <EmptyDescription>
            The faster you answer, the more points you earn. The timer starts as
            soon as you press Start.
          </EmptyDescription>
        </EmptyHeader>
        <Button onClick={handleStart} className="h-auto w-full rounded-xl py-3">
          Start quiz
        </Button>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm leading-snug font-medium">{quiz.question}</p>
        {!submitted && (
          <span className="text-muted-foreground font-mono text-xs tabular-nums">
            {formatElapsed(state.elapsed)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {quiz.answers.map((answer, i) => (
          <button
            key={i}
            disabled={submitted}
            onClick={handleSelect(i)}
            className={cn(
              "rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors",
              ANSWER_STYLES[answerState(i, state.selected, state.isCorrect)],
            )}
          >
            {answer}
          </button>
        ))}
      </div>

      {submitted ? (
        <div className="flex flex-col gap-3">
          <div
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              state.isCorrect ? "text-green-600" : "text-destructive",
            )}
          >
            {state.isCorrect ? (
              <CheckCircle className="size-4 shrink-0" />
            ) : (
              <XCircle className="size-4 shrink-0" />
            )}
            {state.isCorrect
              ? `Correct! +${state.earnedScore} pts`
              : "Wrong answer."}
          </div>
          <Button
            onClick={handleContinue}
            className="h-auto w-full rounded-xl py-3"
          >
            Continue
          </Button>
        </div>
      ) : (
        <Button
          disabled={state.selected === null}
          loading={isPending}
          onClick={handleSubmit}
          className="h-auto w-full rounded-xl py-3"
        >
          Submit
        </Button>
      )}
    </div>
  )
}

export default QuizGame
