import ChartCard from "@lootopia/dashboard/features/analytics/components/ChartCard"
import {
  CHART_AXIS_COLOR,
  CHART_GRID_COLOR,
  CHART_PRIMARY_COLOR,
} from "@lootopia/dashboard/features/analytics/constants"
import type { TopHunt } from "@lootopia/dashboard/features/analytics/types"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const TopHuntsChart = ({ data }: { data: TopHunt[] }) => (
  <ChartCard
    title="Top hunts by participants"
    isEmpty={data.length === 0}
    emptyMessage="No participants yet"
  >
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_GRID_COLOR}
          horizontal={false}
        />
        <XAxis
          type="number"
          allowDecimals={false}
          stroke={CHART_AXIS_COLOR}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="title"
          stroke={CHART_AXIS_COLOR}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <Tooltip cursor={{ fill: CHART_GRID_COLOR, fillOpacity: 0.3 }} />
        <Bar
          dataKey="participants"
          name="Participants"
          fill={CHART_PRIMARY_COLOR}
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
)

export default TopHuntsChart
