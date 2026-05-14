import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "@lootopia/dashboard/components/ui/badge"
import { Button } from "@lootopia/dashboard/components/ui/button"
import { HUNT_GAME_TYPE } from "@lootopia/dashboard/features/hunt/utils/constant"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"

type HuntPoint = HuntFormValues["points"][number]

const GAME_TYPE_LABEL: Record<string, string> = {
  [HUNT_GAME_TYPE.QUIZ]: "Quiz",
  [HUNT_GAME_TYPE.AR]: "AR",
  [HUNT_GAME_TYPE.NONE]: "—",
}

const GAME_TYPE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  [HUNT_GAME_TYPE.QUIZ]: "default",
  [HUNT_GAME_TYPE.AR]: "secondary",
  [HUNT_GAME_TYPE.NONE]: "outline",
}

const formatCoords = (lat: number, lng: number) =>
  `${lat.toFixed(4)}, ${lng.toFixed(4)}`

type HuntPointsListRowProps = {
  point: HuntPoint
  onEdit: (_id: string) => void
  onDelete: (_id: string) => void
}

const HuntPointsListRow = ({
  point,
  onEdit,
  onDelete,
}: HuntPointsListRowProps) => {
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

  const handleEdit = () => onEdit(point.id)
  const handleDelete = () => onDelete(point.id)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border p-3"
    >
      <button
        type="button"
        className="text-muted-foreground shrink-0 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
        {point.position}
      </span>

      <div className="min-w-0 flex-1">
        <Badge variant={GAME_TYPE_VARIANT[point.gameType]}>
          {GAME_TYPE_LABEL[point.gameType]}
        </Badge>
        <p className="text-muted-foreground mt-1 truncate text-xs">
          {formatCoords(point.latitude, point.longitude)}
        </p>
      </div>

      <div className="flex shrink-0 gap-1">
        <Button type="button" variant="ghost" size="icon" onClick={handleEdit}>
          <Pencil />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleDelete}
        >
          <Trash2 className="text-destructive" />
        </Button>
      </div>
    </div>
  )
}

export default HuntPointsListRow
