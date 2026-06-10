export const CHART_PRIMARY_COLOR = "var(--color-primary)"

export const CHART_GRID_COLOR = "var(--color-border)"

export const CHART_AXIS_COLOR = "var(--color-muted-foreground)"

export const CHART_HEIGHT = 280

const DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
})

export const formatChartDay = (day: string) =>
  DAY_FORMATTER.format(new Date(day))
