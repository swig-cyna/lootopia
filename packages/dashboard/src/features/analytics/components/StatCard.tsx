import { Card, CardContent } from "@lootopia/dashboard/components/ui/card"
import type { LucideIcon } from "lucide-react"

type StatCardProps = {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
}

const StatCard = ({ label, value, hint, icon: Icon }: StatCardProps) => (
  <Card size="sm">
    <CardContent className="flex items-start justify-between gap-2">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-muted-foreground text-xs font-medium">
          {label}
        </span>
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
        {hint && <span className="text-muted-foreground text-xs">{hint}</span>}
      </div>
      <div className="bg-primary/10 text-primary shrink-0 rounded-lg p-2">
        <Icon className="size-5" />
      </div>
    </CardContent>
  </Card>
)

export default StatCard
