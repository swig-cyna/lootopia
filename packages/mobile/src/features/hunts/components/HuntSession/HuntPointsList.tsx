type HuntProgressBarProps = {
  total: number
  completed: number
}

const HuntProgressBar = ({ total, completed }: HuntProgressBarProps) => {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Progress</span>
        <span className="text-muted-foreground text-xs font-medium">
          {completed}/{total}
        </span>
      </div>
      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default HuntProgressBar
