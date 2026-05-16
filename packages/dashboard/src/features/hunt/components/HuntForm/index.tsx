import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@lootopia/dashboard/components/ui/card"
import HuntDetails from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntDetails"
import HuntMap, {
  type HuntMapHandle,
} from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntMap"
import HuntPointGameConfig from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntPointGameConfig"
import HuntPointsList from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntPointsList"
import {
  huntSchema,
  type HuntFormValues,
} from "@lootopia/dashboard/features/hunt/schema/hunt"
import { api, useMutation } from "@lootopia/dashboard/lib/api"
import { useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const HuntForm = () => {
  const methods = useForm<HuntFormValues>({
    resolver: standardSchemaResolver(huntSchema),
    defaultValues: {
      title: "",
      description: "",
      points: [],
    },
  })

  const [createHunt, { isPending }] = useMutation(api.hunts.$post, {
    onError: (err) => methods.setError("root", { message: err.message }),
  })

  const mapHandleRef = useRef<HuntMapHandle | null>(null)
  const [editingPointId, setEditingPointId] = useState<string | null>(null)

  const onSubmit = methods.handleSubmit((data) => {
    const points = data.points
      .filter(
        (p): p is Exclude<(typeof data.points)[number], { gameType: "none" }> =>
          p.gameType !== "none",
      )
      .map(({ id: _id, ...point }) => point)

    return createHunt({ json: { ...data, points } })
  })

  const handleEditPoint = (id: string) => {
    setEditingPointId(id)
  }

  const handleCloseConfig = () => {
    setEditingPointId(null)
  }

  const handleDeletePoint = (id: string) => {
    mapHandleRef.current?.removePoint(id)
  }

  return (
    <div className="h-full w-full">
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="flex h-full gap-4">
          <HuntMap handleRef={mapHandleRef} />

          <Card className="flex w-96 shrink-0 flex-col">
            <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto">
              <HuntDetails />

              <HuntPointsList
                onEdit={handleEditPoint}
                onDelete={handleDeletePoint}
              />
            </CardContent>

            <CardFooter className="border-t pt-4">
              <Button type="submit" className="w-full" disabled={isPending}>
                Create hunt
              </Button>
            </CardFooter>
          </Card>
        </form>

        <HuntPointGameConfig
          pointId={editingPointId}
          onClose={handleCloseConfig}
        />
      </FormProvider>
    </div>
  )
}

export default HuntForm
