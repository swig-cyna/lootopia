import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lootopia/dashboard/components/ui/card"
import { CHART_HEIGHT } from "@lootopia/dashboard/features/analytics/constants"
import { type ReactNode } from "react"

type ChartCardProps = {
  title: string
  isEmpty: boolean
  emptyMessage: string
  children: ReactNode
}

const ChartCard = ({
  title,
  isEmpty,
  emptyMessage,
  children,
}: ChartCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {isEmpty ? (
        <div
          className="text-muted-foreground flex items-center justify-center text-sm"
          style={{ height: CHART_HEIGHT }}
        >
          {emptyMessage}
        </div>
      ) : (
        <div style={{ height: CHART_HEIGHT }}>{children}</div>
      )}
    </CardContent>
  </Card>
)

export default ChartCard
