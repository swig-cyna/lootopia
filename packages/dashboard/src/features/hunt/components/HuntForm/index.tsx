import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import HuntFormFields from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntFormFields"
import HuntMap from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntMap"
import PointsList from "@lootopia/dashboard/features/hunt/components/HuntForm/PointsList"
import QuizQuestionDialog, {
  type QuizQuestionValues,
} from "@lootopia/dashboard/features/hunt/components/QuizQuestionDialog"
import {
  huntSchema,
  type HuntFormValues,
} from "@lootopia/dashboard/features/hunt/schema/hunt"
import {
  HUNT_GAME_TYPE,
  type HuntGameType,
} from "@lootopia/dashboard/features/hunt/utils/constant.ts"
import type { HuntPoint } from "@lootopia/dashboard/features/hunt/utils/types"
import { api, useMutation } from "@lootopia/dashboard/lib/api"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"

const HuntForm = () => {
  const [createHunt] = useMutation(api.hunts.$post, {
    onError: (err) => {
      console.error(err)
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HuntFormValues>({
    resolver: standardSchemaResolver(huntSchema),
    defaultValues: { points: [] },
  })

  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [points, setPoints] = useState<HuntPoint[]>([])
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const [editingQuizPointId, setEditingQuizPointId] = useState<string | null>(
    null,
  )

  const editingPoint = useMemo(
    () => points.find((p) => p.id === editingQuizPointId) ?? null,
    [points, editingQuizPointId],
  )
  const editingPointIndex = useMemo(
    () =>
      editingQuizPointId
        ? points.findIndex((p) => p.id === editingQuizPointId)
        : -1,
    [points, editingQuizPointId],
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
        gameType: p.gameType,
        position: index + 1,
        quizQuestion:
          p.gameType === HUNT_GAME_TYPE.QUIZ ? p.quizQuestion : undefined,
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

  const updatePointCoords = useCallback(
    (id: string, lng: number, lat: number) => {
      setPoints((prev) =>
        prev.map((p) => (p.id === id ? { ...p, lng, lat } : p)),
      )
    },
    [],
  )

  const updatePointGameType = useCallback(
    (id: string, gameType: HuntGameType) => {
      setPoints((prev) =>
        prev.map((p) => {
          if (p.id !== id) {
            return p
          }

          return {
            ...p,
            gameType,
            quizQuestion:
              gameType === HUNT_GAME_TYPE.QUIZ ? p.quizQuestion : undefined,
          }
        }),
      )
    },
    [],
  )

  const openQuizEditor = useCallback((id: string) => {
    setEditingQuizPointId(id)
  }, [])

  const saveQuizQuestion = useCallback(
    (quiz: QuizQuestionValues) => {
      if (!editingQuizPointId) {
        return
      }

      setPoints((prev) =>
        prev.map((p) =>
          p.id === editingQuizPointId ? { ...p, quizQuestion: quiz } : p,
        ),
      )
    },
    [editingQuizPointId],
  )

  const flyToPoint = useCallback((point: HuntPoint) => {
    mapRef.current?.flyTo({ center: [point.lng, point.lat], zoom: 14 })
  }, [])

  const reorderPoints = useCallback((reordered: HuntPoint[]) => {
    setPoints(reordered)
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
        "flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground text-sm font-semibold shadow-md cursor-grab active:cursor-grabbing"

      const marker = new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat([lng, lat])
        .addTo(map)

      const id = uuidv4()

      marker.on("dragend", () => {
        const { lng: newLng, lat: newLat } = marker.getLngLat()
        updatePointCoords(id, newLng, newLat)
      })

      setPoints((prev) => [
        ...prev,
        { id, lng, lat, gameType: HUNT_GAME_TYPE.QUIZ, marker },
      ])
    })

    return () => {
      map.remove()
    }
  }, [])

  const onSubmit = (data: HuntFormValues) => createHunt({ json: data })

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <HuntFormFields
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
      />

      <div className="flex min-h-0 flex-1 gap-4">
        <HuntMap mapContainerRef={mapContainerRef} mapInstance={mapInstance} />

        <PointsList
          points={points}
          errors={errors}
          onRemove={removePoint}
          onFlyTo={flyToPoint}
          onChangeGameType={updatePointGameType}
          onEditQuiz={openQuizEditor}
          onReorder={reorderPoints}
        />
      </div>

      <QuizQuestionDialog
        open={editingQuizPointId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingQuizPointId(null)
          }
        }}
        pointLabel={
          editingPointIndex >= 0 ? `Point ${editingPointIndex + 1}` : ""
        }
        initialValue={editingPoint?.quizQuestion}
        onSave={saveQuizQuestion}
      />
    </div>
  )
}

export default HuntForm
