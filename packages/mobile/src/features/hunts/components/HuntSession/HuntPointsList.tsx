type HuntProgressBarProps = {
  total: number
  completed: number
}

const HuntProgressBar = ({ total, completed }: HuntProgressBarProps) => {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Progress</span>
        <span className="text-xs font-medium text-muted-foreground">
          {completed}/{total}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default HuntProgressBar
