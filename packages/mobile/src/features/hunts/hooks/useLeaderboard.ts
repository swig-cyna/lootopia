import authClient from "@lootopia/mobile/features/auth/utils/auth-client"
import { api, useInfiniteQuery } from "@lootopia/mobile/lib/api"
import { useCallback, useState } from "react"

const DEBOUNCE_DELAY_MS = 300

export const useLeaderboard = (huntId: string) => {
  const { data: session } = authClient.useSession()
  const currentUserId = session?.user.id ?? null

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)

  const handleSearchChange = (value: string) => {
    setSearch(value)

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(value)
    }, DEBOUNCE_DELAY_MS)

    setDebounceTimer(timer)
  }

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(api.hunts[":huntId"].leaderboard, {
    param: { huntId },
    query: {
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    },
  })

  const entries = data?.pages.flatMap((page) => page.data) ?? []
  const myRank = data?.pages[0]?.myRank ?? null

  const handleFetchNext = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    search,
    handleSearchChange,
    entries,
    myRank,
    currentUserId,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    handleFetchNext,
  }
}
