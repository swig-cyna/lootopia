import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@lootopia/dashboard/components/ui/card"
import HuntDetails from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntDetails"
import HuntMap from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntMap"
import HuntPointGameConfig from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntPointGameConfig"
import HuntPointsList from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntPointsList"
import HuntReward from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntReward"
import HuntRewardConfig from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntRewardConfig"
import type { HuntForEdit } from "@lootopia/dashboard/features/hunt/hooks/useHunt"
import { useHuntForm } from "@lootopia/dashboard/features/hunt/hooks/useHuntForm"
import { FormProvider } from "react-hook-form"

type HuntFormProps = {
  hunt?: HuntForEdit
}

const HuntForm = ({ hunt }: HuntFormProps) => {
  const {
    methods,
    onSubmit,
    isPending,
    submitLabel,
    mapHandleRef,
    editingPointId,
    isRewardOpen,
    handleEditPoint,
    handleCloseConfig,
    handleDeletePoint,
    handleReorder,
    handleOpenReward,
    handleCloseReward,
  } = useHuntForm(hunt)

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
