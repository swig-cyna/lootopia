export const HUNT_GAME_TYPE = {
  QUIZ: "quiz",
  AR: "ar",
} as const

export type HuntGameType = (typeof HUNT_GAME_TYPE)[keyof typeof HUNT_GAME_TYPE]
