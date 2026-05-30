import type { HuntPoint } from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import ARGame from "./ARGame"
import QuizGame from "./QuizGame"

type GameSheetProps = {
  point: HuntPoint
  onValidate: (_score: number) => void
}

const GAME_TITLE: Record<string, string> = {
  quiz: "Answer the question",
  ar: "AR Activity",
}

const GameComponent = {
  quiz: QuizGame,
  ar: ARGame,
}

const GameSheet = ({ point, onValidate }: GameSheetProps) => {
  const Game = GameComponent[point.game.type]

  return (
    <div className="bg-background border-border absolute inset-x-0 bottom-0 z-30 flex flex-col gap-4 rounded-t-2xl border-t p-5 shadow-2xl">
      <div className="flex flex-col gap-0.5">
        <p className="text-muted-foreground text-xs">Point {point.position}</p>
        <h2 className="text-base font-semibold">
          {GAME_TITLE[point.game.type]}
        </h2>
      </div>

      <Game point={point} onValidate={onValidate} />
    </div>
  )
}

export default GameSheet
