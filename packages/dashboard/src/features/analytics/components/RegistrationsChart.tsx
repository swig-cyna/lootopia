import ChartCard from "@lootopia/dashboard/features/analytics/components/ChartCard"
import {
  CHART_AXIS_COLOR,
  CHART_GRID_COLOR,
  CHART_PRIMARY_COLOR,
  formatChartDay,
} from "@lootopia/dashboard/features/analytics/constants"
import type { RegistrationPoint } from "@lootopia/dashboard/features/analytics/types"
import { type ReactNode } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const formatTooltipLabel = (label: ReactNode) => formatChartDay(String(label))

const RegistrationsChart = ({ data }: { data: RegistrationPoint[] }) => (
  <ChartCard
    title="Registrations over time"
    isEmpty={data.length === 0}
    emptyMessage="No registrations yet"
  >
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_GRID_COLOR}
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tickFormatter={formatChartDay}
          stroke={CHART_AXIS_COLOR}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          stroke={CHART_AXIS_COLOR}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={32}
        />
        <Tooltip labelFormatter={formatTooltipLabel} />
        <Area
          type="monotone"
          dataKey="count"
          name="Registrations"
          stroke={CHART_PRIMARY_COLOR}
          fill={CHART_PRIMARY_COLOR}
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </ChartCard>
)

export default RegistrationsChart
