import { MetaDataGroup, MetaDataGroupItem } from '@/interfaces/meta_interfaces'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo } from 'react'
import MetaGroupAddItem from '@/Components/MetaData/MetaDataGroup/MetaGroupAddItem'
import { Paginator } from '@/ui/ui_interfaces'
import MetaGroupItemList from '@/Components/MetaData/MetaDataGroup/MetaGroupItemList'

interface Props {
  metaDataGroup: MetaDataGroup
  groupItems: Paginator<MetaDataGroupItem>
}

export default function MetaGroupShow({ metaDataGroup, groupItems }: Props) {
  const displayedValues = useMemo(() => {
    return [
      {
        label: 'Name',
        content: metaDataGroup.name,
        id: 1,
      },
    ] as ShowPageItem[]
  }, [metaDataGroup])

  console.log(groupItems)

  return (
    <ShowResourcePage
      title={metaDataGroup.name}
      items={displayedValues}
      backButtonUrl={route('meta-data-group.index')}
    >
      <MetaGroupAddItem metaDataGroup={metaDataGroup} />
      <MetaGroupItemList
        metaGroup={metaDataGroup}
        groupItems={groupItems}
      />
    </ShowResourcePage>
  )
}
