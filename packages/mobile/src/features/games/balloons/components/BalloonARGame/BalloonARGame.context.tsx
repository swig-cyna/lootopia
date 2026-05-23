import { createContext, useContext, type ReactNode } from "react"
import type { useBalloonGame } from "../../hooks/useBalloonGame"

type BalloonGameState = ReturnType<typeof useBalloonGame>

export type BalloonARGameData = BalloonGameState & {
  isPending: boolean
  onConfirmExit: () => void
}

type BalloonARGameContextType = {
  data: BalloonARGameData
}

const BalloonARGameContext = createContext<BalloonARGameContextType | null>(
  null,
)

export const BalloonARGameProvider = ({
  data,
  children,
}: {
  data: BalloonARGameData
  children: ReactNode
}) => (
  <BalloonARGameContext.Provider value={{ data }}>
    {children}
  </BalloonARGameContext.Provider>
)

export const useBalloonARGame = (): BalloonARGameContextType => {
  const ctx = useContext(BalloonARGameContext)

  if (!ctx) {
    throw new Error(
      "useBalloonARGame must be used within BalloonARGameProvider",
    )
  }

  return ctx
}
