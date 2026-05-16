import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@lootopia/dashboard/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@lootopia/dashboard/components/ui/tabs"
import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { HUNT_GAME_TYPE } from "@lootopia/dashboard/features/hunt/utils/constant"
import { useFormContext } from "react-hook-form"
import HuntPointGameConfigArTab from "./HuntPointGameConfigArTab"
import HuntPointGameConfigQuizTab from "./HuntPointGameConfigQuizTab"

type HuntPointGameConfigProps = {
  pointId: string | null
  onClose: () => void
}

const HuntPointGameConfig = ({
  pointId,
  onClose,
}: HuntPointGameConfigProps) => {
  const { getValues } = useFormContext<HuntFormValues>()

  const point = getValues("points").find((p) => p.id === pointId)
  const defaultTab =
    point?.gameType === HUNT_GAME_TYPE.AR
      ? HUNT_GAME_TYPE.AR
      : HUNT_GAME_TYPE.QUIZ

  return (
    <Dialog open={pointId !== null} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Configure game</DialogTitle>
        </DialogHeader>

        <Tabs key={pointId} defaultValue={defaultTab}>
          <TabsList className="w-full">
            <TabsTrigger value={HUNT_GAME_TYPE.QUIZ}>Quiz</TabsTrigger>
            <TabsTrigger value={HUNT_GAME_TYPE.AR}>
              Augmented Reality
            </TabsTrigger>
          </TabsList>

          <TabsContent value={HUNT_GAME_TYPE.QUIZ}>
            <HuntPointGameConfigQuizTab pointId={pointId} onSave={onClose} />
          </TabsContent>

          <TabsContent value={HUNT_GAME_TYPE.AR}>
            <HuntPointGameConfigArTab pointId={pointId} onSave={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default HuntPointGameConfig
