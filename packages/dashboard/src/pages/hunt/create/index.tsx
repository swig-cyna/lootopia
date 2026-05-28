import HuntForm from "@lootopia/dashboard/features/hunt/components/HuntForm"
import type { HuntSubmitData } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { api, getQueryKey, useMutation } from "@lootopia/dashboard/lib/api"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"

const HuntCreatePage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleBack = () => navigate("/hunt")

  const [createHunt, { isPending }] = useMutation(api.hunts.$post, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryKey(api.hunts) })
      navigate("/hunt")
    },
  })

  const handleSubmit = async (data: HuntSubmitData) => {
    await createHunt({ json: data })
  }

  return (
    <HuntForm
      onSubmit={handleSubmit}
      onBack={handleBack}
      isPending={isPending}
      submitLabel="Create hunt"
    />
  )
}

export default HuntCreatePage
