import { useAdminHunts } from "@lootopia/dashboard/features/admin/hooks/useAdminHunts"
import { createContext, useContext, type ReactNode } from "react"

type AdminHuntListData = ReturnType<typeof useAdminHunts>

type AdminHuntListContextType = { data: AdminHuntListData }

const AdminHuntListContext = createContext<AdminHuntListContextType | null>(
  null,
)

export const AdminHuntListProvider = ({
  data,
  children,
}: {
  data: AdminHuntListData
  children: ReactNode
}) => (
  <AdminHuntListContext.Provider value={{ data }}>
    {children}
  </AdminHuntListContext.Provider>
)

export const useAdminHuntListContext = () => {
  const context = useContext(AdminHuntListContext)

  if (!context) {
    throw new Error(
      "useAdminHuntListContext must be used within AdminHuntListProvider",
    )
  }

  return context
}
