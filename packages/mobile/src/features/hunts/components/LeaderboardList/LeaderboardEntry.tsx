import { cn } from "@lootopia/mobile/lib/utils"
import { User } from "lucide-react"

type Entry = {
  rank: number
  userId: string
  name: string
  image: string | null
  totalScore: number
  completedPoints: number
}

type LeaderboardEntryProps = {
  entry: Entry
  isCurrentUser?: boolean
  entryRef?: (_node: HTMLDivElement | null) => void
}

const RANK_COLOR: Record<number, string> = {
  1: "text-yellow-500 font-bold",
  2: "text-gray-400 font-bold",
  3: "text-amber-600 font-bold",
}

const LeaderboardEntry = ({
  entry,
  isCurrentUser = false,
  entryRef,
}: LeaderboardEntryProps) => (
  <div
    ref={entryRef}
    className={cn(
      "bg-muted flex items-center gap-3 rounded-xl px-3 py-2.5",
      isCurrentUser && "border-primary border-2",
    )}
  >
    <span
      className={`w-6 text-center text-sm ${RANK_COLOR[entry.rank] ?? "text-muted-foreground font-medium"}`}
    >
      #{entry.rank}
    </span>

    <div className="bg-background flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
      {entry.image ? (
        <img
          src={entry.image}
          alt={entry.name}
          className="size-full object-cover"
        />
      ) : (
        <User className="text-muted-foreground size-4" />
      )}
    </div>

    <div className="flex min-w-0 flex-1 items-center gap-2">
      <span className="truncate text-sm font-medium">{entry.name}</span>
      {isCurrentUser && (
        <span className="bg-primary text-foreground shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold">
          You
        </span>
      )}
    </div>

    <div className="flex flex-col items-end">
      <span className="text-primary text-sm font-semibold">
        {entry.totalScore} pts
      </span>
      <span className="text-muted-foreground text-xs">
        {entry.completedPoints} points
      </span>
    </div>
  </div>
)

export default LeaderboardEntry
