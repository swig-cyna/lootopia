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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Badge } from "@lootopia/dashboard/components/ui/badge"
import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lootopia/dashboard/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@lootopia/dashboard/components/ui/field"
import { Input } from "@lootopia/dashboard/components/ui/input"
import { ScrollArea } from "@lootopia/dashboard/components/ui/scroll-area"
import { Textarea } from "@lootopia/dashboard/components/ui/textarea"
import { useAddHunt } from "@lootopia/dashboard/features/hunt/hooks/useHunt"
import {
  huntSchema,
  type HuntFormValues,
} from "@lootopia/dashboard/features/hunt/schema/hunt"
import { SearchBox } from "@mapbox/search-js-react"
import { GripVertical, MapPin, Trash2 } from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

interface HuntPoint {
  id: string
  lng: number
  lat: number
  marker: mapboxgl.Marker
}

interface SortablePointItemProps {
  point: HuntPoint
  index: number
  onRemove: (_id: string) => void
  onFlyTo: (_p: HuntPoint) => void
}

const SortablePointItem = ({
  point,
  index,
  onRemove,
  onFlyTo,
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
      className="group flex items-center gap-2 rounded-lg border p-2 text-sm cursor-pointer hover:bg-accent transition-colors"
      onClick={() => onFlyTo(point)}
    >
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
  )
}

const HuntForm = () => {
  const { mutateAsync: createHunt } = useAddHunt()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HuntFormValues>({
    resolver: standardSchemaResolver(huntSchema),
    defaultValues: {
      points: [],
    },
  })

  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [points, setPoints] = useState<HuntPoint[]>([])
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    points.forEach((p, index) => {
      p.marker.getElement().textContent = String(index + 1)
    })

    setValue(
      "points",
      points.map((p, index) => ({
        latitude: p.lat,
        longitude: p.lng,
        gameType: "default",
        position: index + 1,
      })),
    )
  }, [points, setValue])

  const removePoint = useCallback((id: string) => {
    setPoints((prev) => {
      const point = prev.find((p) => p.id === id)
      point?.marker.remove()

      return prev.filter((p) => p.id !== id)
    })
  }, [])

  const flyToPoint = useCallback((point: HuntPoint) => {
    mapRef.current?.flyTo({
      center: [point.lng, point.lat],
      zoom: 14,
    })
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setPoints((prev) => {
        const oldIndex = prev.findIndex((p) => p.id === active.id)
        const newIndex = prev.findIndex((p) => p.id === over.id)

        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current) {
      return undefined
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [2.3522, 48.8566],
      zoom: 5,
    })
    mapRef.current = map
    setMapInstance(map)

    map.addControl(new mapboxgl.NavigationControl(), "top-right")

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat

      const el = document.createElement("div")
      el.className =
        "flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground text-sm font-semibold shadow-md"

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map)

      const id = crypto.randomUUID()

      setPoints((prev) => [...prev, { id, lng, lat, marker }])
    })

    return () => {
      map.remove()
    }
  }, [])

  const onSubmit = (data: HuntFormValues) => createHunt(data)

  return (
    <div className="flex flex-1 flex-col gap-4 h-full">
      <form id="hunt-form" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="pt-0">
            <FieldGroup className="flex-row gap-4">
              <Field className="flex-1">
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  type="text"
                  placeholder="My treasure hunt..."
                  {...register("title")}
                />
                <FieldError errors={[errors.title]} />
              </Field>

              <Field className="flex-[2]">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Describe your hunt..."
                  className="min-h-[38px] resize-none"
                  rows={1}
                  {...register("description")}
                />
                <FieldError errors={[errors.description]} />
              </Field>

              <div className="flex items-end">
                <Button type="submit" form="hunt-form">
                  Create Hunt
                </Button>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </form>

      <div className="flex flex-1 gap-4 min-h-0">
        <Card className="flex-1 min-h-0">
          <CardContent className="flex-1 h-full p-0">
            <div className="relative w-full h-full">
              <div
                ref={mapContainerRef}
                className="w-full h-full rounded-xl min-h-100"
              />
              <div className="absolute top-3 left-3 z-10 w-80 max-w-[calc(100%-1.5rem)]">
                <SearchBox
                  accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                  map={mapInstance ?? undefined}
                  mapboxgl={mapboxgl}
                  marker={false}
                  placeholder="Rechercher une adresse..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
                          onRemove={removePoint}
                          onFlyTo={flyToPoint}
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
      </div>
    </div>
  )
}

export default HuntForm
