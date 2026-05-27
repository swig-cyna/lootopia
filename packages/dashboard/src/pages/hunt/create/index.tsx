import HuntForm from "@lootopia/dashboard/features/hunt/components/HuntForm"
import type { HuntSubmitData } from "@lootopia/dashboard/features/hunt/schema/hunt"
import { api, useMutation } from "@lootopia/dashboard/lib/api"

const HuntCreatePage = () => {
  const [createHunt, { isPending }] = useMutation(api.hunts.$post)

  const handleSubmit = async (data: HuntSubmitData) => {
    await createHunt({ json: data })
  }

  return (
    <HuntForm
      onSubmit={handleSubmit}
      isPending={isPending}
      submitLabel="Create hunt"
    />
  )
}

export default HuntCreatePage
