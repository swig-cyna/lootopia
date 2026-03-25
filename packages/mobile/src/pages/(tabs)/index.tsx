import { Button } from "@lootopia/mobile/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@lootopia/mobile/components/ui/empty"
import { LocateOff } from "lucide-react"

const IndexPage = () => (
  <div className="flex flex-1 flex-col">
    <h1 className="text-3xl mb-3">My hunts</h1>

    <Empty>
      <EmptyHeader>
        <EmptyMedia className="size-14" variant="icon">
          <LocateOff className="size-8" />
        </EmptyMedia>
        <EmptyTitle>No hunts found</EmptyTitle>
        <EmptyDescription>Join a hunt to get started</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="lg">Explore hunts</Button>
      </EmptyContent>
    </Empty>
  </div>
)

export default IndexPage
