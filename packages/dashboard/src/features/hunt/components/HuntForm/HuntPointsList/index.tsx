import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { FieldError } from "@lootopia/dashboard/components/ui/field"
import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { MapPin } from "lucide-react"
import { useFormContext } from "react-hook-form"
import HuntPointsListRow from "./HuntPointsListRow"

type HuntPointsListProps = {
  onEdit: (_id: string) => void
  onDelete: (_id: string) => void
  onReorder: (_orderedIds: string[]) => void
}

const HuntPointsList = ({
  onEdit,
  onDelete,
  onReorder,
}: HuntPointsListProps) => {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<HuntFormValues>()
  const points = watch("points")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const current = getValues("points")
    const oldIndex = current.findIndex((p) => p.id === active.id)
    const newIndex = current.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(current, oldIndex, newIndex).map(
      (p, index) => ({
        ...p,
        position: index + 1,
      }),
    )

    setValue("points", reordered as HuntFormValues["points"])
    onReorder(reordered.map((p) => p.id))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <p className="text-sm font-medium">Points</p>

      {points.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <MapPin className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-center text-sm">
            Click on the map to add points
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={points.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto">
              {points.map((point) => (
                <HuntPointsListRow
                  key={point.id}
                  point={point}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <FieldError errors={[errors.points?.root ?? errors.points]} />
    </div>
  )
}

export default HuntPointsList
