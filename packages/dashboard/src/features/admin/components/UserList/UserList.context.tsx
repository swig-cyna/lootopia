import { useAdminUsers } from "@lootopia/dashboard/features/admin/hooks/useAdminUsers"
import { createContext, useContext, type ReactNode } from "react"

type UserListData = ReturnType<typeof useAdminUsers>

type UserListContextType = { data: UserListData }

const UserListContext = createContext<UserListContextType | null>(null)

export const UserListProvider = ({
  data,
  children,
}: {
  data: UserListData
  children: ReactNode
}) => (
  <UserListContext.Provider value={{ data }}>
    {children}
  </UserListContext.Provider>
)

export const useUserListContext = () => {
  const context = useContext(UserListContext)

  if (!context) {
    throw new Error("useUserListContext must be used within UserListProvider")
  }

  return context
}
