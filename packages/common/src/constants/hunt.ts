export const AR_GAME_IDS = ["balloons"] as const

export type ArGameId = (typeof AR_GAME_IDS)[number]

export const AR_GAMES = [
  {
    id: "balloons" as const,
    label: "Balloon Popping",
    description: "Pop as many balloons as possible before the timer runs out.",
  },
] satisfies { id: ArGameId; label: string; description: string }[]

export const HUNT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const

export type HuntStatus = (typeof HUNT_STATUS)[keyof typeof HUNT_STATUS]

export const HUNT_SORT = {
  RECENT: "recent",
  OLDEST: "oldest",
  TITLE: "title",
} as const

export type HuntSort = (typeof HUNT_SORT)[keyof typeof HUNT_SORT]

export const HUNT_GAME_TYPE = {
  QUIZ: "quiz",
  AR: "ar",
  NONE: "none",
} as const

export type HuntGameType = (typeof HUNT_GAME_TYPE)[keyof typeof HUNT_GAME_TYPE]

export const HUNT_POINTS_MIN = 3
export const HUNT_POINTS_MAX = 5
export const HUNT_TITLE_MIN = 2
export const HUNT_TITLE_MAX = 255
export const QUIZ_ANSWERS_MIN = 2
export const MAX_AR_SCORE = 2000
export const VALIDATION_RADIUS_M = 10
