import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lootopia/mobile/components/ui/card"
import { api } from "@lootopia/mobile/lib/api"
import type { InferResponseType } from "hono/client"
import { ChevronRight, MapPin } from "lucide-react"
import { useNavigate } from "react-router"

type PublishedHunt = Extract<
  InferResponseType<typeof api.hunts.published.$get>,
  { data: unknown }
>["data"][number]

type ExploreHuntCardProps = {
  hunt: PublishedHunt
}

const ExploreHuntCard = ({ hunt }: ExploreHuntCardProps) => {
  const navigate = useNavigate()

  const handleNavigate = () => navigate(`/explore/${hunt.id}`)

  return (
    <Card
      className="hover:bg-muted/50 cursor-pointer transition-colors active:scale-[0.99]"
      onClick={handleNavigate}
    >
      <CardHeader>
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0 flex-1 overflow-hidden">
            <CardTitle className="truncate">{hunt.title}</CardTitle>
            <CardDescription className="truncate">
              {hunt.description}
            </CardDescription>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {hunt.isJoined && (
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Joined
              </span>
            )}
            <ChevronRight className="text-muted-foreground mt-0.5 size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1.5">
          <MapPin className="text-muted-foreground size-3.5" />
          <span className="text-muted-foreground text-xs">
            {hunt.points.length} point{hunt.points.length !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExploreHuntCard
