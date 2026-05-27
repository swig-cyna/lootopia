export const AR_GAME_IDS = ["balloons"] as const

export type ArGameId = (typeof AR_GAME_IDS)[number]

export const AR_GAMES = [
  {
    id: "balloons" as const,
    label: "Balloon Popping",
    description: "Pop as many balloons as possible before the timer runs out.",
  },
] satisfies { id: ArGameId; label: string; description: string }[]
