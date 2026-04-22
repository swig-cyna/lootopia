import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  HUNT_GAME_TYPE,
  type HuntGameType,
} from "@lootopia/dashboard/features/hunt/utils/constant.ts"
import type { HuntPoint } from "@lootopia/dashboard/features/hunt/utils/types"
import { CheckCircle2, GripVertical, Pencil, Trash2 } from "lucide-react"

const GAME_TYPE_OPTIONS: { value: HuntGameType; label: string }[] = [
  { value: HUNT_GAME_TYPE.QUIZ, label: "Quiz" },
  { value: HUNT_GAME_TYPE.AR, label: "ar" },
]

interface SortablePointItemProps {
  point: HuntPoint
  index: number
  onRemove: (_id: string) => void
  onFlyTo: (_p: HuntPoint) => void
  onChangeGameType: (_id: string, _gameType: HuntGameType) => void
  onEditQuiz: (_id: string) => void
}

const SortablePointItem = ({
  point,
  index,
  onRemove,
  onFlyTo,
  onChangeGameType,
  onEditQuiz,
}: SortablePointItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: point.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex flex-col gap-2 rounded-lg border p-2 text-sm cursor-pointer hover:bg-accent transition-colors"
      onClick={() => onFlyTo(point)}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing shrink-0 text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="size-4" />
        </button>
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium">Point {index + 1}</p>
          <p className="text-xs text-muted-foreground">
            {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(point.id)
          }}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
      <div className="flex gap-1 pl-8">
        {GAME_TYPE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={point.gameType === option.value ? "default" : "outline"}
            size="sm"
            className="h-7 flex-1 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              onChangeGameType(point.id, option.value)
            }}
          >
            {option.label}
          </Button>
        ))}
      </div>
      {point.gameType === HUNT_GAME_TYPE.QUIZ && (
        <div className="flex items-center gap-2 pl-8">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 flex-1 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              onEditQuiz(point.id)
            }}
          >
            <Pencil />
            {point.quizQuestion ? "Edit quiz" : "Configure quiz"}
          </Button>
          {point.quizQuestion && (
            <CheckCircle2
              className="size-4 shrink-0 text-emerald-500"
              aria-label="Quiz configured"
            />
          )}
        </div>
      )}
    </div>
  )
}

export default SortablePointItem
