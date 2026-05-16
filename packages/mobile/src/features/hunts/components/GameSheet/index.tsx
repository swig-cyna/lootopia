import type { HuntPoint } from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import ARGame from "./ARGame"
import QuizGame from "./QuizGame"

type GameSheetProps = {
  point: HuntPoint
  onValidate: () => void
}

const GAME_TITLE: Record<string, string> = {
  quiz: "Answer the question",
  ar: "AR Activity",
}

const GameSheet = ({ point, onValidate }: GameSheetProps) => (
  <div className="bg-background border-border absolute inset-x-0 bottom-0 z-30 flex flex-col gap-4 rounded-t-2xl border-t p-5 shadow-2xl">
    <div className="bg-muted mx-auto h-1 w-10 rounded-full" />

    <div className="flex flex-col gap-0.5">
      <p className="text-muted-foreground text-xs">Point {point.position}</p>
      <h2 className="text-base font-semibold">{GAME_TITLE[point.gameType]}</h2>
    </div>

    {point.gameType === "quiz" && point.quizQuestion ? (
      <QuizGame quiz={point.quizQuestion} onValidate={onValidate} />
    ) : (
      <ARGame pointId={point.id} onValidate={onValidate} />
    )}
  </div>
)

export default GameSheet
