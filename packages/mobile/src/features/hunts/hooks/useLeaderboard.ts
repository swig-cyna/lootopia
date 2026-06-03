import authClient from "@lootopia/mobile/features/auth/utils/auth-client"
import { api, useInfiniteQuery } from "@lootopia/mobile/lib/api"
import { useDebounceValue } from "@lootopia/mobile/hooks/useDebounce"
import { useCallback, useState } from "react"

const DEBOUNCE_DELAY_MS = 300

export const useLeaderboard = (huntId: string) => {
  const { data: session } = authClient.useSession()
  const currentUserId = session?.user.id ?? null

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useDebounceValue(
    "",
    DEBOUNCE_DELAY_MS,
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setDebouncedSearch(value)
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
