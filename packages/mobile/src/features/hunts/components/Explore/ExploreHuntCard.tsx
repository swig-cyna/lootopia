import { Button } from "@lootopia/mobile/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@lootopia/mobile/components/ui/card"
import { api, getQueryKey, useMutation } from "@lootopia/mobile/lib/api"
import queryClient from "@lootopia/mobile/lib/queryClient"
import type { InferResponseType } from "hono/client"

type PublishedHunt = Extract<
  InferResponseType<typeof api.hunts.published.$get>,
  { data: unknown }
>["data"][number]

type ExploreHuntCardProps = {
  hunt: PublishedHunt
}

const ExploreHuntCard = ({ hunt }: ExploreHuntCardProps) => {
  const [joinHunt, { isPending }] = useMutation(api.hunts[":id"].join.$post, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey(api.hunts.published),
      })
      queryClient.invalidateQueries({ queryKey: getQueryKey(api.hunts.mine) })
    },
  })

  const handleJoin = () => {
    joinHunt({ param: { id: hunt.id } })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{hunt.title}</CardTitle>
        <CardDescription>{hunt.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-xs">
          {hunt.points.length} point{hunt.points.length !== 1 ? "s" : ""}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          variant={hunt.isJoined ? "secondary" : "default"}
          loading={isPending}
          disabled={hunt.isJoined}
          onClick={handleJoin}
        >
          {hunt.isJoined ? "Joined" : "Join"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ExploreHuntCard
