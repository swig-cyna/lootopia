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
      className="cursor-pointer hover:bg-muted/50 transition-colors active:scale-[0.99]"
      onClick={() => navigate(`/hunts/${hunt.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle>{hunt.title}</CardTitle>
            <CardDescription>{hunt.description}</CardDescription>
          </div>
          <ChevronRight className="size-5 text-muted-foreground shrink-0 mt-0.5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          {hunt.points.length} point{hunt.points.length !== 1 ? "s" : ""}
        </p>
      </CardContent>
    </Card>
  )
}

export default MyHuntCard
