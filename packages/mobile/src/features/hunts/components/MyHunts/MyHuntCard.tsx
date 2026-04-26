import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lootopia/mobile/components/ui/card"
import { api } from "@lootopia/mobile/lib/api"
import type { InferResponseType } from "hono/client"

type MyHunt = Extract<
  InferResponseType<typeof api.hunts.mine.$get>,
  { data: unknown }
>["data"][number]

type MyHuntCardProps = {
  hunt: MyHunt
}

const MyHuntCard = ({ hunt }: MyHuntCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{hunt.title}</CardTitle>
      <CardDescription>{hunt.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-xs text-muted-foreground">
        {hunt.points.length} point{hunt.points.length !== 1 ? "s" : ""}
      </p>
    </CardContent>
  </Card>
)

export default MyHuntCard
