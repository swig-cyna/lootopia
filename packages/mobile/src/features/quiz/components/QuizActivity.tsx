import type { QuizQuestion } from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import { api, useMutation } from "@lootopia/mobile/lib/api"
import { cn } from "@lootopia/mobile/lib/utils"
import { CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

type QuizActivityProps = {
  quiz: QuizQuestion
  onValidate: () => void
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

const QuizActivity = ({ quiz, onValidate }: QuizActivityProps) => {
  const [selected, setSelected] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const [validatePoint, { isPending }] = useMutation(
    api.hunts.points[":id"].validate.$post,
  )

  const handleSelect = (i: number) => {
    setSelected(i)
  }

  const handleSubmit = async () => {
    if (selected === null) {
      return
    }

    const result = await validatePoint({
      param: { id: quiz.huntPointId },
      json: { gameType: "quiz", selectedAnswerIndex: selected },
    })

    setIsCorrect(result.isCorrect)
  }

  const submitted = isCorrect !== null

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium leading-snug">{quiz.question}</p>

      <div className="flex flex-col gap-2">
        {quiz.answers.map((answer, i) => (
          <button
            key={i}
            disabled={submitted}
            onClick={() => handleSelect(i)}
            className={cn(
              "rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors",
              ANSWER_STYLES[answerState(i, selected, isCorrect)],
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
              isCorrect ? "text-green-600" : "text-destructive",
            )}
          >
            {isCorrect ? (
              <CheckCircle className="size-4 shrink-0" />
            ) : (
              <XCircle className="size-4 shrink-0" />
            )}
            {isCorrect ? "Correct!" : "Wrong answer."}
          </div>
          <button
            onClick={onValidate}
            className="bg-primary text-primary-foreground w-full rounded-xl py-3 text-sm font-semibold"
          >
            Continue
          </button>
        </div>
      ) : (
        <button
          disabled={selected === null || isPending}
          onClick={handleSubmit}
          className={cn(
            "w-full rounded-xl py-3 text-sm font-semibold transition-colors",
            selected !== null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          Submit
        </button>
      )}
    </div>
  )
}

export default QuizActivity
