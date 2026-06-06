import { type Role } from "@lootopia/auth/constants"
import {
  ADMIN_USERS_PAGE_SIZE,
  SEARCH_DEBOUNCE_MS,
} from "@lootopia/dashboard/features/admin/constants"
import type { CreateUserValues } from "@lootopia/dashboard/features/admin/schema/user"
import authClient from "@lootopia/dashboard/features/auth/utils/auth-client"
import { useDebouncedValue } from "@lootopia/dashboard/hooks/useDebouncedValue"
import queryClient from "@lootopia/dashboard/lib/queryClient"
import {
  useMutation as useReactMutation,
  useQuery as useReactQuery,
} from "@tanstack/react-query"
import { useState } from "react"

const ADMIN_USERS_QUERY_KEY = "admin-users"

type ListUsersData = Awaited<
  ReturnType<typeof authClient.admin.listUsers>
>["data"]

export type AdminUser = NonNullable<ListUsersData>["users"][number]

type AdminUsersFilters = {
  search: string
  role?: Role
  page: number
}

export const useAdminUsers = () => {
  const [filters, setFilters] = useState<AdminUsersFilters>({
    search: "",
    role: undefined,
    page: 1,
  })

  const debouncedSearch = useDebouncedValue(filters.search, SEARCH_DEBOUNCE_MS)

  const query = useReactQuery({
    queryKey: [
      ADMIN_USERS_QUERY_KEY,
      { search: debouncedSearch, role: filters.role, page: filters.page },
    ],
    queryFn: async () => {
      const offset = (filters.page - 1) * ADMIN_USERS_PAGE_SIZE

      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit: ADMIN_USERS_PAGE_SIZE,
          offset,
          sortBy: "createdAt",
          sortDirection: "desc",
          ...(debouncedSearch
            ? {
                searchField: "email" as const,
                searchOperator: "contains" as const,
                searchValue: debouncedSearch,
              }
            : {}),
          ...(filters.role
            ? {
                filterField: "role",
                filterValue: filters.role,
                filterOperator: "eq" as const,
              }
            : {}),
        },
      })

      if (error) {
        throw new Error(error.message ?? "Failed to load users")
      }

      return data
    },
  })

  const invalidateUsers = () =>
    queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_QUERY_KEY] })

  const createUserMutation = useReactMutation({
    mutationFn: async (values: CreateUserValues) => {
      const { error } = await authClient.admin.createUser(values)

      if (error) {
        throw new Error(error.message ?? "Failed to create user")
      }
    },
    onSuccess: invalidateUsers,
  })

  const setRoleMutation = useReactMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { error } = await authClient.admin.setRole({ userId, role })

      if (error) {
        throw new Error(error.message ?? "Failed to update role")
      }
    },
    onSuccess: invalidateUsers,
  })

  const banMutation = useReactMutation({
    mutationFn: async ({
      userId,
      banReason,
    }: {
      userId: string
      banReason?: string
    }) => {
      const { error } = await authClient.admin.banUser({ userId, banReason })

      if (error) {
        throw new Error(error.message ?? "Failed to ban user")
      }
    },
    onSuccess: invalidateUsers,
  })

  const unbanMutation = useReactMutation({
    mutationFn: async (userId: string) => {
      const { error } = await authClient.admin.unbanUser({ userId })

      if (error) {
        throw new Error(error.message ?? "Failed to unban user")
      }
    },
    onSuccess: invalidateUsers,
  })

  const setSearch = (search: string) =>
    setFilters((prev) => ({ ...prev, search, page: 1 }))

  const setRole = (role?: Role) =>
    setFilters((prev) => ({ ...prev, role, page: 1 }))

  const setPage = (page: number) => setFilters((prev) => ({ ...prev, page }))

  const createUser = (values: CreateUserValues) =>
    createUserMutation.mutateAsync(values)

  const changeRole = (userId: string, role: Role) =>
    setRoleMutation.mutateAsync({ userId, role })

  const banUser = (userId: string, banReason?: string) =>
    banMutation.mutateAsync({ userId, banReason })

  const unbanUser = (userId: string) => unbanMutation.mutateAsync(userId)

  const total = query.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_USERS_PAGE_SIZE))

  const metadata = {
    page: filters.page,
    totalPages,
    total,
    hasPrev: filters.page > 1,
    hasNext: filters.page < totalPages,
  }

  return {
    users: query.data?.users ?? [],
    metadata,
    total,
    isLoading: query.isLoading,
    isError: query.isError,
    filters,
    setSearch,
    setRole,
    setPage,
    createUser,
    changeRole,
    banUser,
    unbanUser,
    isMutating:
      createUserMutation.isPending ||
      setRoleMutation.isPending ||
      banMutation.isPending ||
      unbanMutation.isPending,
  }
}
