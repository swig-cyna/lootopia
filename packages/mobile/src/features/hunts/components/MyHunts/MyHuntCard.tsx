import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lootopia/mobile/components/ui/card"
import { api } from "@lootopia/mobile/lib/api"
import { ChevronRight } from "lucide-react"
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
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle>{hunt.title}</CardTitle>
            <CardDescription>{hunt.description}</CardDescription>
          </div>
          <ChevronRight className="text-muted-foreground mt-0.5 size-5 shrink-0" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-xs">
          {hunt.points.length} point{hunt.points.length !== 1 ? "s" : ""}
        </p>
      </CardContent>
    </Card>
  )
}

export default MyHuntCard
