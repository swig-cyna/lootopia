import authClient from "@lootopia/mobile/features/auth/utils/auth-client"
import { useDebounceValue } from "@lootopia/mobile/hooks/useDebounce"
import { api, useInfiniteQuery } from "@lootopia/mobile/lib/api"
import { useCallback, useEffect, useRef, useState } from "react"

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

  const [isMyEntryVisible, setIsMyEntryVisible] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const myEntryRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (!node) {
      return
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => setIsMyEntryVisible(entry.isIntersecting),
      { threshold: 0.5 },
    )

    observerRef.current.observe(node)
  }, [])

  useEffect(() => () => observerRef.current?.disconnect(), [])

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
    myEntryRef,
    isMyEntryVisible,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    handleFetchNext,
  }
}
