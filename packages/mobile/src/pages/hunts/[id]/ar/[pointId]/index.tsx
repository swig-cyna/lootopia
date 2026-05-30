import {
  AR_GAME_IDS,
  HUNT_GAME_TYPE,
  type ArGameId,
} from "@lootopia/common/constants/hunt"
import { BalloonARGame } from "@lootopia/mobile/features/games/balloons"
import { api, useQuery } from "@lootopia/mobile/lib/api"
import queryClient from "@lootopia/mobile/lib/queryClient"
import { LoaderCircle } from "lucide-react"
import { type ComponentType } from "react"
import { useNavigate, useParams } from "react-router"

type ARGameComponentProps = {
  pointId: string
  onValidate: () => void
  onClose: () => void
}

const AR_GAME_REGISTRY: Record<
  ArGameId,
  ComponentType<ARGameComponentProps>
> = {
  balloons: BalloonARGame,
}

const isValidArGameId = (id: string | null | undefined): id is ArGameId =>
  id !== null &&
  id !== undefined &&
  (AR_GAME_IDS as readonly string[]).includes(id)

const ARGamePage = () => {
  const { id, pointId } = useParams<{ id: string; pointId: string }>()
  const navigate = useNavigate()

  const { data: hunt, isPending } = useQuery(api.hunts.published[":huntId"], {
    param: { huntId: id! },
  })

  const handleBack = () => navigate(`/hunts/${id}`)

  const handleValidate = () => {
    queryClient.invalidateQueries()
    navigate(`/hunts/${id}`)
  }

  if (!id || !pointId) {
    return null
  }

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <LoaderCircle className="text-primary size-8 animate-spin" />
      </div>
    )
  }

  const point = hunt?.points.find((p) => p.id === pointId)
  const arId =
    point?.game.type === HUNT_GAME_TYPE.AR ? point.game.arId : undefined

  if (!isValidArGameId(arId)) {
    return null
  }

  const GameComponent = AR_GAME_REGISTRY[arId]

  return (
    <GameComponent
      pointId={pointId}
      onValidate={handleValidate}
      onClose={handleBack}
    />
  )
}

export default ARGamePage
