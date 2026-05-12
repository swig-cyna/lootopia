import { useHuntSession } from "@lootopia/mobile/features/hunts/context/HuntSessionContext"
import { useHuntMap } from "@lootopia/mobile/features/map/context/HuntMapContext"
import { formatDistance } from "@lootopia/mobile/features/map/utils/distance"
import { MapPin, Navigation } from "lucide-react"

const HuntNextPointPanel = () => {
  const { nextPoint } = useHuntSession()
  const { distanceToPoint, flyToPoint } = useHuntMap()

  if (!nextPoint) {
    return null
  }

  const distance = distanceToPoint(nextPoint)

  return (
    <div
      className="bg-muted flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-opacity active:opacity-70"
      onClick={() => flyToPoint(nextPoint)}
    >
      <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        <MapPin className="text-primary-foreground size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs">Next point</p>
        <p className="text-sm font-medium">Point {nextPoint.position}</p>
      </div>
      {distance !== null ? (
        <div className="flex shrink-0 items-center gap-1.5">
          <Navigation className="text-primary-foreground size-4" />
          <span className="text-primary-foreground text-sm font-semibold">
            {formatDistance(distance)}
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground shrink-0 text-xs">
          Enable GPS
        </span>
      )}
    </div>
  )
}

export default HuntNextPointPanel
