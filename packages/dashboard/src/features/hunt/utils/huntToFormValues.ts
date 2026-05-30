import type { HuntFormValues } from "@lootopia/dashboard/features/hunt/schema/hunt"
import type { HuntForEdit } from "@lootopia/dashboard/features/hunt/utils/types"

export const huntToFormValues = (hunt: HuntForEdit): HuntFormValues => ({
  title: hunt.title,
  description: hunt.description,
  points: [...hunt.points].sort(
    (a, b) => a.position - b.position,
  ) as HuntFormValues["points"],
  reward: {
    topX: hunt.reward?.topX ?? 0,
    promoCode: hunt.reward?.promoCode ?? "",
  },
})
