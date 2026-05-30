import {
  HUNT_SORT,
  HUNT_STATUS,
  type HuntSort,
  type HuntStatus,
} from "@lootopia/common/constants/hunt"

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
    className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  },
}

export const HUNT_SORT_OPTIONS: { value: HuntSort; label: string }[] = [
  { value: HUNT_SORT.RECENT, label: "Recent" },
  { value: HUNT_SORT.OLDEST, label: "Oldest" },
  { value: HUNT_SORT.TITLE, label: "Title (A-Z)" },
]

export const HUNT_LIST_PAGE_SIZE = 10

export const SEARCH_DEBOUNCE_MS = 300
