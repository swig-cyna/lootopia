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
      className="flex items-center gap-3 bg-muted rounded-xl p-3 cursor-pointer active:opacity-70 transition-opacity"
      onClick={() => flyToPoint(nextPoint)}
    >
      <div className="shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        <MapPin className="size-5 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">Next point</p>
        <p className="text-sm font-medium">Point {nextPoint.position}</p>
      </div>
      {distance !== null ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <Navigation className="size-4 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">
            {formatDistance(distance)}
          </span>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground shrink-0">
          Enable GPS
        </span>
      )}
    </div>
  )
}

export default HuntNextPointPanel
