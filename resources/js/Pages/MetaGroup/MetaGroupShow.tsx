import { MetaDataGroup, MetaDataGroupItem } from '@/interfaces/meta_interfaces'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo } from 'react'
import MetaGroupAddItem from '@/Components/MetaData/MetaDataGroup/MetaGroupAddItem'
import { Paginator } from '@/ui/ui_interfaces'
import MetaGroupItemList from '@/Components/MetaData/MetaDataGroup/MetaGroupItemList'

interface Props {
  metaDataGroup: MetaDataGroup
  groupItems: Paginator<MetaDataGroupItem>
  type?: string
  subtype?: string
}

export default function MetaGroupShow({ metaDataGroup, groupItems, type, subtype }: Props) {
  const displayedValues = useMemo(() => {
    return [
      {
        label: 'Name',
        content: metaDataGroup.name,
        id: 1,
      },
    ] as ShowPageItem[]
  }, [metaDataGroup])

  return (
    <ShowResourcePage
      title={metaDataGroup.name}
      items={displayedValues}
      backUrl={route('meta-data-group.index', { type: 'definitions', subtype: 'groups' })}
      type={type}
      subtype={subtype}
    >
      <MetaGroupAddItem metaDataGroup={metaDataGroup} />
      <MetaGroupItemList
        metaGroup={metaDataGroup}
        groupItems={groupItems}
      />
    </ShowResourcePage>
  )
}
