import {
  HUNT_SORT,
  HUNT_STATUS,
  type HuntSort,
  type HuntStatus,
} from "@lootopia/common/constants/hunt"
import {
  ADMIN_HUNTS_PAGE_SIZE,
  SEARCH_DEBOUNCE_MS,
} from "@lootopia/dashboard/features/admin/constants"
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

type AdminHuntsResponse = Exclude<
  InferResponseType<typeof api.admin.hunts.$get>,
  { error: unknown }
>

export type AdminHunt = AdminHuntsResponse["data"][number]

type AdminHuntsFilters = {
  status?: HuntStatus
  search: string
  sort: HuntSort
  page: number
}

const EMPTY_COUNTS = { all: 0, published: 0, draft: 0 }

export const useAdminHunts = () => {
  const [filters, setFilters] = useState<AdminHuntsFilters>({
    status: undefined,
    search: "",
    sort: HUNT_SORT.RECENT,
    page: 1,
  })

  const debouncedSearch = useDebouncedValue(filters.search, SEARCH_DEBOUNCE_MS)

  const query = useQuery(api.admin.hunts, {
    query: {
      page: String(filters.page),
      limit: String(ADMIN_HUNTS_PAGE_SIZE),
      sort: filters.sort,
      ...(filters.status ? { status: filters.status } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    },
  })

  const invalidateHunts = () =>
    queryClient.invalidateQueries({ queryKey: getQueryKey(api.admin.hunts) })

  const [updateStatus, { isPending: isUpdatingStatus }] = useMutation(
    api.admin.hunts[":huntId"].status.$patch,
    { onSuccess: invalidateHunts },
  )

  const [removeHunt, { isPending: isDeleting }] = useMutation(
    api.admin.hunts[":huntId"].$delete,
    { onSuccess: invalidateHunts },
  )

  const setStatus = (status?: HuntStatus) =>
    setFilters((prev) => ({ ...prev, status, page: 1 }))

  const setSearch = (search: string) =>
    setFilters((prev) => ({ ...prev, search, page: 1 }))

  const setSort = (sort: HuntSort) =>
    setFilters((prev) => ({ ...prev, sort, page: 1 }))

  const setPage = (page: number) => setFilters((prev) => ({ ...prev, page }))

  const toggleStatus = (hunt: AdminHunt) => {
    const nextStatus =
      hunt.status === HUNT_STATUS.PUBLISHED
        ? HUNT_STATUS.DRAFT
        : HUNT_STATUS.PUBLISHED

    updateStatus({ param: { huntId: hunt.id }, json: { status: nextStatus } })
  }

  const deleteHunt = (id: string) => {
    removeHunt({ param: { huntId: id } })
  }

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
  }
}
