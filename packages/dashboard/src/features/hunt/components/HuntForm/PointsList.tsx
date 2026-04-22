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
import { Badge } from "@lootopia/dashboard/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lootopia/dashboard/components/ui/card"
import { ScrollArea } from "@lootopia/dashboard/components/ui/scroll-area"
import SortablePointItem from "@lootopia/dashboard/features/hunt/components/HuntForm/SortablePointItem"
import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import type { HuntGameType } from "@lootopia/dashboard/features/hunt/utils/constant.ts"
import type { HuntPoint } from "@lootopia/dashboard/features/hunt/utils/types"
import { MapPin } from "lucide-react"
import { useCallback } from "react"
import type { FieldErrors } from "react-hook-form"

interface PointsListProps {
  points: HuntPoint[]
  errors: FieldErrors<HuntFormValues>
  onRemove: (_id: string) => void
  onFlyTo: (_p: HuntPoint) => void
  onChangeGameType: (_id: string, _gameType: HuntGameType) => void
  onEditQuiz: (_id: string) => void
  onReorder: (_points: HuntPoint[]) => void
}

const PointsList = ({
  points,
  errors,
  onRemove,
  onFlyTo,
  onChangeGameType,
  onEditQuiz,
  onReorder,
}: PointsListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = points.findIndex((p) => p.id === active.id)
        const newIndex = points.findIndex((p) => p.id === over.id)
        onReorder(arrayMove(points, oldIndex, newIndex))
      }
    },
    [points, onReorder],
  )

  return (
    <Card className="w-72 shrink-0 min-h-0 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="size-4" />
          Points
          {points.length > 0 && (
            <Badge variant="secondary">{points.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 px-0 flex flex-col gap-2">
        {points.length === 0 ? (
          <div className="px-4">
            <p className="text-sm text-muted-foreground">
              Click on the map to place between 3 and 5 points.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1 min-h-0 px-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={points.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2 pr-3">
                  {points.map((point, index) => (
                    <SortablePointItem
                      key={point.id}
                      point={point}
                      index={index}
                      onRemove={onRemove}
                      onFlyTo={onFlyTo}
                      onChangeGameType={onChangeGameType}
                      onEditQuiz={onEditQuiz}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </ScrollArea>
        )}
        {errors.points && (
          <p className="px-4 text-sm text-destructive">
            {errors.points.message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default PointsList
