import { Button } from "@lootopia/dashboard/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@lootopia/dashboard/components/ui/empty"
import { Loader } from "@lootopia/dashboard/components/ui/loader"
import HuntForm from "@lootopia/dashboard/features/hunt/components/HuntForm"
import type { HuntSubmitData } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { huntToFormValues } from "@lootopia/dashboard/features/hunt/utils/huntToFormValues"
import { api, useMutation, useQuery } from "@lootopia/dashboard/lib/api"
import queryClient from "@lootopia/dashboard/lib/queryClient"
import { MapPinOff } from "lucide-react"
import { useNavigate, useParams } from "react-router"

const HuntEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const handleBack = () => navigate("/hunt")

  const {
    data: hunt,
    isLoading,
    isError,
  } = useQuery(api.hunts[":id"], {
    param: { id: id! },
  })

  const [updateHunt, { isPending }] = useMutation(api.hunts[":id"].$put, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.hunts.$url().toString()] })
      navigate("/hunt")
    },
  })

  const handleSubmit = async (data: HuntSubmitData) => {
    await updateHunt({
      param: { id: id! },
      json: {
        ...data,
        reward: {
          ...hunt!.reward,
          topX: data.reward.topX,
          promoCode: data.reward.promoCode,
        },
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader size="xl" color="primary" />
      </div>
    )
  }

  if (isError || !hunt) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPinOff />
          </EmptyMedia>
          <EmptyTitle>Hunt not found</EmptyTitle>
          <EmptyDescription>
            This hunt doesn't exist or has been deleted.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={handleBack}>
            Back to hunts
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <HuntForm
      defaultValues={huntToFormValues(hunt)}
      onSubmit={handleSubmit}
      isPending={isPending}
      submitLabel="Save changes"
    />
  )
}

export default HuntEditPage
