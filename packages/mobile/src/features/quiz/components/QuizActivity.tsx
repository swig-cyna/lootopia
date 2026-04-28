import { cn } from "@lootopia/mobile/lib/utils"
import { CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

export type QuizQuestion = {
  question: string
  answers: string[]
  correctAnswerIndex: number
}

type QuizActivityProps = {
  quiz: QuizQuestion
  onValidate: () => void
}

const answerState = (
  i: number,
  selected: number | null,
  submitted: boolean,
  correctIndex: number,
) => {
  if (!submitted) {
    return selected === i ? "selected" : "idle"
  }

  if (i === correctIndex) {
    return "correct"
  }

  if (i === selected) {
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
  const [submitted, setSubmitted] = useState(false)
  const isCorrect = selected === quiz.correctAnswerIndex

  const handleSubmit = () => {
    if (selected === null) {
      return
    }

    setSubmitted(true)
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium leading-snug">{quiz.question}</p>

      <div className="flex flex-col gap-2">
        {quiz.answers.map((answer, i) => (
          <button
            key={i}
            disabled={submitted}
            onClick={() => setSelected(i)}
            className={cn(
              "text-left px-4 py-3 rounded-xl text-sm border-2 transition-colors",
              ANSWER_STYLES[
                answerState(i, selected, submitted, quiz.correctAnswerIndex)
              ],
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
            className="w-full py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground"
          >
            Continue
          </button>
        </div>
      ) : (
        <button
          disabled={selected === null}
          onClick={handleSubmit}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-semibold transition-colors",
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
