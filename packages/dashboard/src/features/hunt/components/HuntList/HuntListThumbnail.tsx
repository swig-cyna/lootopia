import type { OrganizerHunt } from "@lootopia/dashboard/features/hunt/hooks/useHuntList"
import { cn } from "@lootopia/dashboard/lib/utils"

type HuntPoint = OrganizerHunt["points"][number]

const EDGE_PADDING = 12
const SPREAD = 100 - EDGE_PADDING * 2

const GRID_BACKGROUND = {
  backgroundImage:
    "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
  backgroundSize: "8px 8px",
}

const normalize = (value: number, min: number, max: number) =>
  max === min ? 50 : ((value - min) / (max - min)) * SPREAD + EDGE_PADDING

const HuntListThumbnail = ({ points }: { points: HuntPoint[] }) => {
  if (points.length === 0) {
    return <div className="bg-muted size-11 shrink-0 rounded-md" />
  }

  const latitudes = points.map((point) => point.latitude)
  const longitudes = points.map((point) => point.longitude)
  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const minLng = Math.min(...longitudes)
  const maxLng = Math.max(...longitudes)

  return (
    <div
      className="bg-primary/5 relative size-11 shrink-0 overflow-hidden rounded-md border"
      style={GRID_BACKGROUND}
    >
      {points.map((point, index) => (
        <span
          key={point.id}
          className={cn(
            "bg-primary text-primary-foreground absolute flex size-3.5 -translate-x-1/2 -translate-y-1/2",
            "items-center justify-center rounded-full text-[8px] font-semibold",
          )}
          style={{
            left: `${normalize(point.longitude, minLng, maxLng)}%`,
            top: `${100 - normalize(point.latitude, minLat, maxLat)}%`,
          }}
        >
          {index + 1}
        </span>
      ))}
    </div>
  )
}

export default HuntListThumbnail
