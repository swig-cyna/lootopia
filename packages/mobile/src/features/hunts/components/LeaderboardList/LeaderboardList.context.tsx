import { createContext, useContext, type ReactNode } from "react"

type LeaderboardEntry = {
  rank: number
  userId: string
  name: string
  image: string | null
  totalScore: number
  completedPoints: number
}

type MyRank = {
  rank: number
  totalScore: number
  completedPoints: number
} | null

type LeaderboardListData = {
  search: string
  handleSearchChange: (_value: string) => void
  entries: LeaderboardEntry[]
  myRank: MyRank
  currentUserId: string | null
  myEntryRef: (_node: HTMLDivElement | null) => void
  isMyEntryVisible: boolean
  isPending: boolean
  isError: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  handleFetchNext: () => void
}

type LeaderboardListContextType = {
  data: LeaderboardListData
}

const LeaderboardListContext = createContext<LeaderboardListContextType | null>(
  null,
)

export const LeaderboardListProvider = ({
  data,
  children,
}: {
  data: LeaderboardListData
  children: ReactNode
}) => (
  <LeaderboardListContext.Provider value={{ data }}>
    {children}
  </LeaderboardListContext.Provider>
)

export const useLeaderboardList = () => {
  const ctx = useContext(LeaderboardListContext)

  if (!ctx) {
    throw new Error(
      "useLeaderboardList must be used within LeaderboardListProvider",
    )
  }

  return ctx
}
