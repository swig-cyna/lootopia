import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@lootopia/dashboard/components/ui/field"
import { Input } from "@lootopia/dashboard/components/ui/input"
import {
  RadioGroup,
  RadioGroupItem,
} from "@lootopia/dashboard/components/ui/radio-group"
import {
  quizConfigSchema,
  type QuizConfigValues,
} from "@lootopia/common/schemas/hunt"
import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { Plus, Trash2 } from "lucide-react"
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form"
const NO_ANSWER_SELECTED = -1

type HuntPointGameConfigQuizTabProps = {
  pointId: string | null
  onSave: () => void
}

const HuntPointGameConfigQuizTab = ({
  pointId,
  onSave,
}: HuntPointGameConfigQuizTabProps) => {
  const { getValues, setValue } = useFormContext<HuntFormValues>()

  const point = getValues("points").find((p) => p.id === pointId)
  const existing = point?.game?.type === "quiz" ? point.game.quiz : undefined

  const methods = useForm<QuizConfigValues>({
    resolver: zodResolver(quizConfigSchema),
    defaultValues: existing ?? {
      question: "",
      answers: ["", ""],
      correctIndex: NO_ANSWER_SELECTED,
    },
  })

  const answers = methods.watch("answers")

  const handleAddAnswer = () => {
    methods.setValue("answers", [...answers, ""])
  }

  const handleRemoveAnswer = (index: number) => () => {
    const current = methods.getValues("correctIndex")

    if (current === index) {
      methods.setValue("correctIndex", NO_ANSWER_SELECTED)
    } else if (current > index) {
      methods.setValue("correctIndex", current - 1)
    }

    methods.setValue(
      "answers",
      answers.filter((_, i) => i !== index),
    )
  }

  const onSubmit = methods.handleSubmit((data) => {
    const points = getValues("points")
    setValue(
      "points",
      points.map((p) =>
        p.id === pointId
          ? { ...p, game: { type: "quiz" as const, quiz: data } }
          : p,
      ) as HuntFormValues["points"],
    )
    onSave()
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="question">Question</FieldLabel>
            <Input id="question" {...methods.register("question")} />
            <FieldError errors={[methods.formState.errors.question]} />
          </Field>

          <div className="flex flex-col gap-2">
            <FieldLabel>Answers</FieldLabel>
            <Controller
              control={methods.control}
              name="correctIndex"
              render={({ field }) => (
                <RadioGroup
                  value={field.value >= 0 ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(parseInt(v, 10))}
                  className="flex flex-col gap-2"
                >
                  {answers.map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={String(index)}
                        id={`answer-${index}`}
                      />
                      <Input
                        placeholder={`Answer ${index + 1}`}
                        {...methods.register(`answers.${index}`)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveAnswer(index)}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            <FieldError
              errors={[
                methods.formState.errors.answers?.root,
                methods.formState.errors.correctIndex,
              ]}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAnswer}
            >
              <Plus />
              Add answer
            </Button>
          </div>
        </FieldGroup>

        <Button type="submit">Save</Button>
      </form>
    </FormProvider>
  )
}

export default HuntPointGameConfigQuizTab
