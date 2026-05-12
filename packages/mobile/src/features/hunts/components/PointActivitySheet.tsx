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
  <div className="bg-background border-border absolute inset-x-0 bottom-0 z-30 flex flex-col gap-4 rounded-t-2xl border-t p-5 shadow-2xl">
    <div className="bg-muted mx-auto h-1 w-10 rounded-full" />

    <div className="flex flex-col gap-0.5">
      <p className="text-muted-foreground text-xs">Point {point.position}</p>
      <h2 className="text-base font-semibold">
        {point.gameType === "quiz" ? "Answer the question" : "AR Activity"}
      </h2>
    </div>

    {point.gameType === "quiz" && point.quizQuestion ? (
      <QuizActivity quiz={point.quizQuestion} onValidate={onValidate} />
    ) : (
      <div className="flex flex-col items-center gap-3 py-4">
        <p className="text-muted-foreground text-center text-sm">
          AR activity coming soon.
        </p>
        <button
          onClick={onValidate}
          className="bg-primary text-primary-foreground rounded-xl px-6 py-2.5 text-sm font-semibold"
        >
          Validate point
        </button>
      </div>
    )}
  </div>
)

export default PointActivitySheet
