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
import HuntReward from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntReward"
import HuntRewardConfig from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntRewardConfig"
import {
  huntSchema,
  type HuntFormValues,
  type HuntSubmitData,
} from "@lootopia/dashboard/features/hunt/schema/hunt"
import { useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

type HuntFormProps = {
  defaultValues?: HuntFormValues
  onSubmit: (_data: HuntSubmitData) => Promise<void>
  isPending: boolean
  submitLabel: string
}

const EMPTY_DEFAULTS: HuntFormValues = {
  title: "",
  description: "",
  points: [],
  reward: { topX: 1, promoCode: "" },
}

const HuntForm = ({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
}: HuntFormProps) => {
  const methods = useForm<HuntFormValues>({
    resolver: standardSchemaResolver(huntSchema),
    defaultValues: defaultValues ?? EMPTY_DEFAULTS,
  })

  const mapHandleRef = useRef<HuntMapHandle | null>(null)
  const [editingPointId, setEditingPointId] = useState<string | null>(null)
  const [isRewardOpen, setIsRewardOpen] = useState(false)

  const handleSubmit = methods.handleSubmit(async (data) => {
    const points = data.points
      .filter(
        (p): p is Exclude<(typeof data.points)[number], { gameType: "none" }> =>
          p.gameType !== "none",
      )
      .map(({ id: _id, ...point }) => point)

    try {
      await onSubmit({
        title: data.title,
        description: data.description,
        points,
        reward: data.reward,
      })
    } catch (err) {
      if (err instanceof Error) {
        methods.setError("root", { message: err.message })
      }
    }
  })

  const handleEditPoint = (id: string) => setEditingPointId(id)
  const handleCloseConfig = () => setEditingPointId(null)
  const handleDeletePoint = (id: string) =>
    mapHandleRef.current?.removePoint(id)
  const handleReorder = (orderedIds: string[]) =>
    mapHandleRef.current?.reorderPoints(orderedIds)
  const handleOpenReward = () => setIsRewardOpen(true)
  const handleCloseReward = () => setIsRewardOpen(false)

  return (
    <div className="h-full w-full">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="flex h-full gap-4">
          <HuntMap handleRef={mapHandleRef} />

          <Card className="flex w-96 shrink-0 flex-col">
            <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto">
              <HuntDetails />

              <HuntPointsList
                onEdit={handleEditPoint}
                onDelete={handleDeletePoint}
                onReorder={handleReorder}
              />
            </CardContent>

            <CardFooter className="flex-col gap-3 border-t pt-4">
              <HuntReward onConfigure={handleOpenReward} />

              <Button type="submit" className="w-full" disabled={isPending}>
                {submitLabel}
              </Button>
            </CardFooter>
          </Card>
        </form>

        <HuntPointGameConfig
          pointId={editingPointId}
          onClose={handleCloseConfig}
        />

        <HuntRewardConfig open={isRewardOpen} onClose={handleCloseReward} />
      </FormProvider>
    </div>
  )
}

export default HuntForm
