import HuntNextPointPanel from "@lootopia/mobile/features/hunts/components/HuntSession/HuntNextPointPanel"
import HuntProgressBar from "@lootopia/mobile/features/hunts/components/HuntSession/HuntPointsList"
import { useHuntSession } from "@lootopia/mobile/features/hunts/context/HuntSessionContext"

const HuntInfoPanel = () => {
  const { sortedPoints, nextPoint, completedIds } = useHuntSession()

  return (
    <div className="bg-background border-t border-border px-4 pt-4 pb-6 flex flex-col gap-3">
      {nextPoint ? (
        <HuntNextPointPanel />
      ) : (
        <div className="bg-muted rounded-xl p-3 text-center">
          <p className="text-sm font-medium text-primary">Hunt complete!</p>
        </div>
      )}

      <HuntProgressBar total={sortedPoints.length} completed={completedIds.size} />
    </div>
  )
}

export default HuntInfoPanel
