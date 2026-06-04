import ChartCard from "@lootopia/dashboard/features/analytics/components/ChartCard"
import {
  CHART_AXIS_COLOR,
  CHART_GRID_COLOR,
  CHART_PRIMARY_COLOR,
} from "@lootopia/dashboard/features/analytics/constants"
import type { PointFunnelEntry } from "@lootopia/dashboard/features/analytics/types"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const PointFunnelChart = ({ data }: { data: PointFunnelEntry[] }) => {
  const chartData = data.map((point, index) => ({
    ...point,
    label: `Point ${index + 1}`,
  }))

  return (
    <ChartCard
      title="Completions per point"
      isEmpty={chartData.length === 0}
      emptyMessage="No points to display"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_GRID_COLOR}
            vertical={false}
          />
          <XAxis
            dataKey="label"
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
          <Tooltip cursor={{ fill: CHART_GRID_COLOR, fillOpacity: 0.3 }} />
          <Bar
            dataKey="completions"
            name="Completions"
            fill={CHART_PRIMARY_COLOR}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export default PointFunnelChart
