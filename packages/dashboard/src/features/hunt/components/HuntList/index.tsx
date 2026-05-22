import { HuntListProvider } from "@lootopia/dashboard/features/hunt/components/HuntList/HuntList.context"
import HuntListFilters from "@lootopia/dashboard/features/hunt/components/HuntList/HuntListFilters"
import HuntListHeader from "@lootopia/dashboard/features/hunt/components/HuntList/HuntListHeader"
import HuntListPagination from "@lootopia/dashboard/features/hunt/components/HuntList/HuntListPagination"
import HuntListTable from "@lootopia/dashboard/features/hunt/components/HuntList/HuntListTable"
import { useHuntList } from "@lootopia/dashboard/features/hunt/hooks/useHuntList"

const HuntList = () => {
  const data = useHuntList()

  return (
    <HuntListProvider data={data}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <HuntListHeader />
        <HuntListFilters />
        <HuntListTable />
        <HuntListPagination />
      </div>
    </HuntListProvider>
  )
}

export default HuntList
