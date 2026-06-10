import { ROLES, type Role } from "@lootopia/auth/constants"
import {
  HUNT_SORT,
  HUNT_STATUS,
  type HuntSort,
  type HuntStatus,
} from "@lootopia/common/constants/hunt"

export const ADMIN_USERS_PAGE_SIZE = 10

export const ADMIN_HUNTS_PAGE_SIZE = 10

export const SEARCH_DEBOUNCE_MS = 300

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

export const HUNT_SORT_OPTIONS: Array<{ value: HuntSort; label: string }> = [
  { value: HUNT_SORT.RECENT, label: "Recent" },
  { value: HUNT_SORT.OLDEST, label: "Oldest" },
  { value: HUNT_SORT.TITLE, label: "Title (A-Z)" },
]

export const ROLE_LABEL: Record<Role, string> = {
  [ROLES.PLAYER]: "Player",
  [ROLES.ORGANIZER]: "Organizer",
  [ROLES.ADMIN]: "Admin",
}

type BadgeVariant = "default" | "secondary" | "outline"

export const ROLE_BADGE_VARIANT: Record<Role, BadgeVariant> = {
  [ROLES.PLAYER]: "outline",
  [ROLES.ORGANIZER]: "secondary",
  [ROLES.ADMIN]: "default",
}

export const ALL_ROLES_TAB = "all"

export const ROLE_FILTER_TABS: Array<{
  value: Role | typeof ALL_ROLES_TAB
  label: string
}> = [
  { value: ALL_ROLES_TAB, label: "All" },
  { value: ROLES.PLAYER, label: "Players" },
  { value: ROLES.ORGANIZER, label: "Organizers" },
  { value: ROLES.ADMIN, label: "Admins" },
]

export const ROLE_OPTIONS = (Object.keys(ROLE_LABEL) as Role[]).map(
  (value) => ({
    value,
    label: ROLE_LABEL[value],
  }),
)
