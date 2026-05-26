import { Button } from "@lootopia/dashboard/components/ui/button"
import { Loader } from "@lootopia/dashboard/components/ui/loader"
import HuntForm from "@lootopia/dashboard/features/hunt/components/HuntForm"
import { useHunt } from "@lootopia/dashboard/features/hunt/hooks/useHunt"
import { useNavigate, useParams } from "react-router"

const HuntEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { hunt, isLoading, isError } = useHunt(id!)

  const handleBack = () => navigate("/hunt")

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader size="xl" color="primary" />
      </div>
    )
  }

  if (isError || !hunt) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-medium">Hunt not found</p>
        <p className="text-muted-foreground max-w-sm text-sm">
          This hunt doesn't exist or has been deleted.
        </p>
        <Button variant="outline" onClick={handleBack}>
          Back to hunts
        </Button>
      </div>
    )
  }

  return <HuntForm hunt={hunt} />
}

export default HuntEditPage
