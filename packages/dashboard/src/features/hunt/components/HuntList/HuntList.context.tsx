import { useHuntList } from "@lootopia/dashboard/features/hunt/hooks/useHuntList"
import { createContext, useContext, type ReactNode } from "react"

type HuntListData = ReturnType<typeof useHuntList>

type HuntListContextType = { data: HuntListData }

const HuntListContext = createContext<HuntListContextType | null>(null)

export const HuntListProvider = ({
  data,
  children,
}: {
  data: HuntListData
  children: ReactNode
}) => (
  <HuntListContext.Provider value={{ data }}>
    {children}
  </HuntListContext.Provider>
)

export const useHuntListContext = () => {
  const context = useContext(HuntListContext)

  if (!context) {
    throw new Error("useHuntListContext must be used within HuntListProvider")
  }

  return context
}
