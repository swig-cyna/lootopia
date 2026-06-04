import { Loader } from "@lootopia/dashboard/components/ui/loader"
import RegistrationsChart from "@lootopia/dashboard/features/analytics/components/RegistrationsChart"
import StatCard from "@lootopia/dashboard/features/analytics/components/StatCard"
import TopHuntsChart from "@lootopia/dashboard/features/analytics/components/TopHuntsChart"
import { useOrganizerStats } from "@lootopia/dashboard/features/analytics/hooks/useOrganizerStats"
import { Gift, Map, Target, Users } from "lucide-react"

const OrganizerStats = () => {
  const { data, isLoading, isError } = useOrganizerStats()

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader size="xl" color="primary" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <p className="text-destructive text-sm">Failed to load statistics.</p>
    )
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview across all your hunts
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total hunts"
          value={data.totalHunts}
          hint={`${data.publishedHunts} live · ${data.draftHunts} draft`}
          icon={Map}
        />
        <StatCard
          label="Participants"
          value={data.totalParticipants}
          hint={`${data.totalFinishers} finished`}
          icon={Users}
        />
        <StatCard
          label="Completion rate"
          value={`${data.completionRate}%`}
          hint="Finishers / participants"
          icon={Target}
        />
        <StatCard
          label="Rewards claimed"
          value={data.totalRewardsClaimed}
          icon={Gift}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RegistrationsChart data={data.registrations} />
        <TopHuntsChart data={data.topHunts} />
      </div>
    </div>
  )
}

export default OrganizerStats
