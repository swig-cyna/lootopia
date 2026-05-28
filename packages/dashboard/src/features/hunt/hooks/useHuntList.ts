import {
  HUNT_SORT,
  HUNT_STATUS,
  type HuntSort,
  type HuntStatus,
} from "@lootopia/common/constants/hunt"
import {
  HUNT_LIST_PAGE_SIZE,
  SEARCH_DEBOUNCE_MS,
} from "@lootopia/dashboard/features/hunt/utils/constants"
import { useDebouncedValue } from "@lootopia/dashboard/hooks/useDebouncedValue"
import {
  api,
  getQueryKey,
  useMutation,
  useQuery,
} from "@lootopia/dashboard/lib/api"
import queryClient from "@lootopia/dashboard/lib/queryClient"
import type { InferResponseType } from "hono/client"
import { useState } from "react"
import { useNavigate } from "react-router"

type HuntsResponse = Exclude<
  InferResponseType<typeof api.hunts.$get>,
  { error: unknown }
>

export type OrganizerHunt = HuntsResponse["data"][number]

type HuntListFilters = {
  status?: HuntStatus
  search: string
  sort: HuntSort
  page: number
}

const EMPTY_COUNTS = { all: 0, published: 0, draft: 0 }

export const useHuntList = () => {
  const navigate = useNavigate()

  const [filters, setFilters] = useState<HuntListFilters>({
    status: undefined,
    search: "",
    sort: HUNT_SORT.RECENT,
    page: 1,
  })

  const debouncedSearch = useDebouncedValue(filters.search, SEARCH_DEBOUNCE_MS)

  const query = useQuery(api.hunts, {
    query: {
      page: String(filters.page),
      limit: String(HUNT_LIST_PAGE_SIZE),
      sort: filters.sort,
      ...(filters.status ? { status: filters.status } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    },
  })

  const [updateStatus, { isPending: isUpdatingStatus }] = useMutation(
    api.hunts[":huntId"].status.$patch,
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: getQueryKey(api.hunts) }),
    },
  )

  const [removeHunt, { isPending: isDeleting }] = useMutation(
    api.hunts[":huntId"].$delete,
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: getQueryKey(api.hunts) }),
    },
  )

  const setStatus = (status?: HuntStatus) =>
    setFilters((prev) => ({ ...prev, status, page: 1 }))

  const setSearch = (search: string) =>
    setFilters((prev) => ({ ...prev, search, page: 1 }))

  const setSort = (sort: HuntSort) =>
    setFilters((prev) => ({ ...prev, sort, page: 1 }))

  const setPage = (page: number) => setFilters((prev) => ({ ...prev, page }))

  const toggleStatus = (hunt: OrganizerHunt) => {
    const nextStatus =
      hunt.status === HUNT_STATUS.PUBLISHED
        ? HUNT_STATUS.DRAFT
        : HUNT_STATUS.PUBLISHED

    updateStatus({ param: { huntId: hunt.id }, json: { status: nextStatus } })
  }

  const deleteHunt = (id: string) => {
    removeHunt({ param: { huntId: id } })
  }

  const goToCreate = () => navigate("/hunt/create")

  const goToEdit = (id: string) => navigate(`/hunt/${id}/edit`)

  return {
    hunts: query.data?.data ?? [],
    counts: query.data?.counts ?? EMPTY_COUNTS,
    metadata: query.data?.metadata,
    isLoading: query.isLoading,
    isError: query.isError,
    filters,
    setStatus,
    setSearch,
    setSort,
    setPage,
    toggleStatus,
    deleteHunt,
    isMutating: isUpdatingStatus || isDeleting,
    goToCreate,
    goToEdit,
  }
}
