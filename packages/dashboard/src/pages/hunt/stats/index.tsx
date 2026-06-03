import HuntStats from "@lootopia/dashboard/features/analytics/components/HuntStats"
import { useParams } from "react-router"

const HuntStatsPage = () => {
  const { id } = useParams<{ id: string }>()

  return <HuntStats huntId={id!} />
}

export default HuntStatsPage
