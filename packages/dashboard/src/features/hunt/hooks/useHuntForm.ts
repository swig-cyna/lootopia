import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import type { HuntMapHandle } from "@lootopia/dashboard/features/hunt/components/HuntForm/HuntMap"
import type { HuntForEdit } from "@lootopia/dashboard/features/hunt/hooks/useHunt"
import {
  huntSchema,
  type HuntFormValues,
} from "@lootopia/dashboard/features/hunt/schema/hunt"
import { huntToFormValues } from "@lootopia/dashboard/features/hunt/utils/huntToFormValues"
import { api, useMutation } from "@lootopia/dashboard/lib/api"
import queryClient from "@lootopia/dashboard/lib/queryClient"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"

const EMPTY_DEFAULTS: HuntFormValues = {
  title: "",
  description: "",
  points: [],
  reward: { topX: 1, promoCode: "" },
}

const SUBMIT_LABEL = {
  create: "Create hunt",
  edit: "Save changes",
} as const

export const useHuntForm = (hunt?: HuntForEdit) => {
  const isEdit = Boolean(hunt)
  const navigate = useNavigate()

  const methods = useForm<HuntFormValues>({
    resolver: standardSchemaResolver(huntSchema),
    defaultValues: hunt ? huntToFormValues(hunt) : EMPTY_DEFAULTS,
  })

  const handleError = (err: Error) =>
    methods.setError("root", { message: err.message })

  const [createHunt, { isPending: isCreating }] = useMutation(api.hunts.$post, {
    onError: handleError,
  })

  const [updateHunt, { isPending: isUpdating }] = useMutation(
    api.hunts[":id"].$put,
    {
      onError: handleError,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [api.hunts.$url().toString()],
        })
        navigate("/hunt")
      },
    },
  )

  const mapHandleRef = useRef<HuntMapHandle | null>(null)
  const [editingPointId, setEditingPointId] = useState<string | null>(null)
  const [isRewardOpen, setIsRewardOpen] = useState(false)

  const onSubmit = methods.handleSubmit((data) => {
    const points = data.points
      .filter(
        (p): p is Exclude<(typeof data.points)[number], { gameType: "none" }> =>
          p.gameType !== "none",
      )
      .map(({ id: _id, ...point }) => point)

    if (hunt) {
      return updateHunt({
        param: { id: hunt.id },
        json: {
          title: data.title,
          description: data.description,
          points,
          reward: {
            ...hunt.reward,
            topX: data.reward.topX,
            promoCode: data.reward.promoCode,
          },
        },
      })
    }

    return createHunt({ json: { ...data, points } })
  })

  const handleEditPoint = (id: string) => {
    setEditingPointId(id)
  }

  const handleCloseConfig = () => {
    setEditingPointId(null)
  }

  const handleDeletePoint = (id: string) => {
    mapHandleRef.current?.removePoint(id)
  }

  const handleReorder = (orderedIds: string[]) => {
    mapHandleRef.current?.reorderPoints(orderedIds)
  }

  const handleOpenReward = () => {
    setIsRewardOpen(true)
  }

  const handleCloseReward = () => {
    setIsRewardOpen(false)
  }

  return {
    methods,
    onSubmit,
    isPending: isCreating || isUpdating,
    submitLabel: isEdit ? SUBMIT_LABEL.edit : SUBMIT_LABEL.create,
    mapHandleRef,
    editingPointId,
    isRewardOpen,
    handleEditPoint,
    handleCloseConfig,
    handleDeletePoint,
    handleReorder,
    handleOpenReward,
    handleCloseReward,
  }
}
