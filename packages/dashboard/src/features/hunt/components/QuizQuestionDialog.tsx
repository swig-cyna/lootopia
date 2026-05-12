import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lootopia/dashboard/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@lootopia/dashboard/components/ui/field"
import { Input } from "@lootopia/dashboard/components/ui/input"
import { Textarea } from "@lootopia/dashboard/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

export interface QuizQuestionValues {
  question: string
  answers: string[]
  correctAnswerIndex: number
}

interface QuizQuestionDialogProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  pointLabel: string
  initialValue?: QuizQuestionValues
  onSave: (_quiz: QuizQuestionValues) => void
}

interface AnswerItem {
  id: string
  value: string
}

const MAX_ANSWERS = 6

const buildAnswerItems = (values: string[]): AnswerItem[] =>
  values.map((value) => ({ id: uuidv4(), value }))

const buildInitialAnswers = (initial?: QuizQuestionValues): AnswerItem[] => {
  const base =
    initial && initial.answers.length >= 2 ? initial.answers : ["", ""]

  return buildAnswerItems(base)
}

interface QuizFieldErrors {
  question?: string
  answers?: (string | undefined)[]
}

const QuizQuestionDialog = ({
  open,
  onOpenChange,
  pointLabel,
  initialValue,
  onSave,
}: QuizQuestionDialogProps) => {
  const [question, setQuestion] = useState("")
  const [answers, setAnswers] = useState<AnswerItem[]>(() =>
    buildInitialAnswers(initialValue),
  )
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0)
  const [errors, setErrors] = useState<QuizFieldErrors>({})

  useEffect(() => {
    if (!open) {
      return
    }

    setQuestion(initialValue?.question ?? "")
    setAnswers(buildInitialAnswers(initialValue))
    setCorrectAnswerIndex(initialValue?.correctAnswerIndex ?? 0)
    setErrors({})
  }, [open, initialValue])

  const updateAnswer = (index: number, value: string) => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === index ? { ...a, value } : a)),
    )
  }

  const addAnswer = () => {
    if (answers.length >= MAX_ANSWERS) {
      return
    }

    setAnswers((prev) => [...prev, { id: uuidv4(), value: "" }])
  }

  const removeAnswer = (index: number) => {
    if (answers.length <= 2) {
      return
    }

    setAnswers((prev) => prev.filter((_, i) => i !== index))
    setCorrectAnswerIndex((prev) => {
      if (prev === index) {
        return 0
      }

      return prev > index ? prev - 1 : prev
    })
  }

  const handleSubmit = (event: {
    preventDefault: () => void
    stopPropagation: () => void
  }) => {
    event.preventDefault()
    event.stopPropagation()

    const trimmedQuestion = question.trim()
    const trimmedAnswers = answers.map((a) => a.value.trim())

    const nextErrors: QuizFieldErrors = {}

    if (!trimmedQuestion) {
      nextErrors.question = "Question is required"
    }

    const answerErrors = trimmedAnswers.map((a) =>
      a ? undefined : "Answer cannot be empty",
    )

    if (answerErrors.some(Boolean)) {
      nextErrors.answers = answerErrors
    }

    if (nextErrors.question || nextErrors.answers) {
      setErrors(nextErrors)

      return
    }

    onSave({
      question: trimmedQuestion,
      answers: trimmedAnswers,
      correctAnswerIndex,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Configure quiz — {pointLabel}</DialogTitle>
          <DialogDescription>
            Write the question and list the possible answers. Pick the one that
            players need to select to validate this point.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="quiz-question">Question</FieldLabel>
              <Textarea
                id="quiz-question"
                placeholder="What is the capital of France?"
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <FieldError
                errors={
                  errors.question ? [{ message: errors.question }] : undefined
                }
              />
            </Field>

            <Field>
              <FieldLabel>Answers</FieldLabel>
              <div className="flex flex-col gap-2">
                {answers.map((answer, index) => (
                  <div key={answer.id} className="flex items-center gap-2">
                    <label className="flex flex-1 items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        className="accent-primary size-4"
                        checked={correctAnswerIndex === index}
                        onChange={() => setCorrectAnswerIndex(index)}
                        aria-label={`Mark answer ${index + 1} as correct`}
                      />
                      <Input
                        placeholder={`Answer ${index + 1}`}
                        value={answer.value}
                        onChange={(e) => updateAnswer(index, e.target.value)}
                        aria-invalid={Boolean(errors.answers?.[index])}
                      />
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeAnswer(index)}
                      disabled={answers.length <= 2}
                      aria-label={`Remove answer ${index + 1}`}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
                {errors.answers?.some(Boolean) && (
                  <p className="text-destructive text-sm">
                    Every answer must be filled in.
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={addAnswer}
                  disabled={answers.length >= MAX_ANSWERS}
                >
                  <Plus />
                  Add answer
                </Button>
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save quiz</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default QuizQuestionDialog
