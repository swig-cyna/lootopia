import { Badge } from "@lootopia/dashboard/components/ui/badge"
import { Button } from "@lootopia/dashboard/components/ui/button"
import { Loader } from "@lootopia/dashboard/components/ui/loader"
import PointFunnelChart from "@lootopia/dashboard/features/analytics/components/PointFunnelChart"
import RegistrationsChart from "@lootopia/dashboard/features/analytics/components/RegistrationsChart"
import StatCard from "@lootopia/dashboard/features/analytics/components/StatCard"
import { useHuntStats } from "@lootopia/dashboard/features/analytics/hooks/useHuntStats"
import { HUNT_STATUS_BADGE } from "@lootopia/dashboard/features/hunt/utils/constants"
import { cn } from "@lootopia/dashboard/lib/utils"
import { ArrowLeft, Flag, Gift, Star, Target, Users } from "lucide-react"
import { useNavigate } from "react-router"

const HuntStats = ({ huntId }: { huntId: string }) => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useHuntStats(huntId)

  const handleBack = () => navigate("/hunt")

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader size="xl" color="primary" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-destructive text-sm">Failed to load statistics.</p>
        <Button variant="outline" onClick={handleBack}>
          Back to hunts
        </Button>
      </div>
    )
  }

  const statusBadge = HUNT_STATUS_BADGE[data.status]
  const rewardHint =
    data.rewardTopX !== null ? `Top ${data.rewardTopX} winners` : undefined

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft />
        </Button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-xl font-semibold">{data.title}</h1>
            <Badge className={cn(statusBadge.className)}>
              {statusBadge.label}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Hunt statistics</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Participants" value={data.participants} icon={Users} />
        <StatCard label="Finishers" value={data.finishers} icon={Flag} />
        <StatCard
          label="Completion rate"
          value={`${data.completionRate}%`}
          hint="Finishers / participants"
          icon={Target}
        />
        <StatCard label="Average score" value={data.averageScore} icon={Star} />
        <StatCard
          label="Rewards claimed"
          value={data.rewardsClaimed}
          hint={rewardHint}
          icon={Gift}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PointFunnelChart data={data.pointFunnel} />
        <RegistrationsChart data={data.registrations} />
      </div>
    </div>
  )
}

export default HuntStats
