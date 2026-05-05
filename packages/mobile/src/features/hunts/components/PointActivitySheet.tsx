import QuizActivity, {
  type QuizQuestion,
} from "@lootopia/mobile/features/quiz/components/QuizActivity"

type HuntPoint = {
  id: string
  position: number
  gameType: "quiz" | "ar"
  quizQuestion?: QuizQuestion
}

type PointActivitySheetProps = {
  point: HuntPoint
  onValidate: () => void
}

const PointActivitySheet = ({ point, onValidate }: PointActivitySheetProps) => (
  <div className="absolute inset-x-0 bottom-0 z-30 bg-background rounded-t-2xl shadow-2xl border-t border-border p-5 flex flex-col gap-4">
    <div className="w-10 h-1 rounded-full bg-muted mx-auto" />

    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-muted-foreground">Point {point.position}</p>
      <h2 className="font-semibold text-base">
        {point.gameType === "quiz" ? "Answer the question" : "AR Activity"}
      </h2>
    </div>

    {point.gameType === "quiz" && point.quizQuestion ? (
      <QuizActivity quiz={point.quizQuestion} onValidate={onValidate} />
    ) : (
      <div className="flex flex-col items-center gap-3 py-4">
        <p className="text-sm text-muted-foreground text-center">
          AR activity coming soon.
        </p>
        <button
          onClick={onValidate}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold"
        >
          Validate point
        </button>
      </div>
    )}
  </div>
)

export default PointActivitySheet
