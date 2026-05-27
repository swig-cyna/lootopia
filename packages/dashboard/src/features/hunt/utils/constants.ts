export const HUNT_GAME_TYPE = {
  QUIZ: "quiz",
  AR: "ar",
  NONE: "none",
} as const

export type HuntGameType = (typeof HUNT_GAME_TYPE)[keyof typeof HUNT_GAME_TYPE]

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

export const HUNT_STATUS_BADGE: Record<
  HuntStatus,
  { label: string; className: string }
> = {
  [HUNT_STATUS.PUBLISHED]: {
    label: "Live",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  [HUNT_STATUS.DRAFT]: {
    label: "Draft",
    className: "border border-dashed text-muted-foreground",
  },
}

export const HUNT_SORT_OPTIONS: { value: HuntSort; label: string }[] = [
  { value: HUNT_SORT.RECENT, label: "Recent" },
  { value: HUNT_SORT.OLDEST, label: "Oldest" },
  { value: HUNT_SORT.TITLE, label: "Title (A-Z)" },
]

export const HUNT_LIST_PAGE_SIZE = 10

export const SEARCH_DEBOUNCE_MS = 300

export const HUNT_LIST_GRID_COLS =
  "grid grid-cols-[minmax(0,1fr)_64px_104px_72px_160px_88px_44px] items-center gap-4"
