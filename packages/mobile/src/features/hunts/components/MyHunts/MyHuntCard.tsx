import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lootopia/mobile/components/ui/card"
import { api } from "@lootopia/mobile/lib/api"
import { ChevronRight, MapPin } from "lucide-react"
import type { InferResponseType } from "hono/client"
import { useNavigate } from "react-router"

type MyHunt = Extract<
  InferResponseType<typeof api.hunts.mine.$get>,
  { data: unknown }
>["data"][number]

type MyHuntCardProps = {
  hunt: MyHunt
}

const MyHuntCard = ({ hunt }: MyHuntCardProps) => {
  const navigate = useNavigate()

  return (
    <Card
      className="hover:bg-muted/50 cursor-pointer transition-colors active:scale-[0.99]"
      onClick={() => navigate(`/hunts/${hunt.id}`)}
    >
      <CardHeader>
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0 flex-1 overflow-hidden">
            <CardTitle className="truncate">{hunt.title}</CardTitle>
            <CardDescription className="truncate">
              {hunt.description}
            </CardDescription>
          </div>
          <ChevronRight className="text-muted-foreground mt-0.5 size-5 shrink-0" />
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

export default MyHuntCard
