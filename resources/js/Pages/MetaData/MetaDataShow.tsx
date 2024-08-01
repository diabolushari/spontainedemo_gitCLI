import { MetaData } from '@/interfaces/meta_interfaces'
import { useMemo } from 'react'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import CardHeader from '@/ui/Card/CardHeader'
import Card from '@/ui/Card/Card'
import StrongText from '@/typograpy/StrongText'

interface Props {
  metaData: MetaData
}

export default function MetaDataShow({ metaData }: Props) {
  const displayedItems: ShowPageItem[] = useMemo(() => {
    return [
      {
        id: 1,
        label: 'Name',
        content: metaData.name,
        type: 'text',
      },
      {
        id: 2,
        label: 'Description',
        content: metaData.description,
        type: 'text',
      },
      {
        id: 3,
        label: 'Structure',
        contentDescription: metaData.meta_structure?.structure_name,
        content: route('meta-data.index', {
          structure: metaData.meta_structure?.id,
        }),
        type: 'link',
      },
      {
        id: 4,
        label: 'Created At',
        content: metaData.created_at,
        type: 'date',
      },
      {
        id: 5,
        label: 'Updated At',
        content: metaData.updated_at,
        type: 'date',
      },
    ]
  }, [metaData])

  return (
    <ShowResourcePage
      items={displayedItems}
      title={metaData.name}
      backButtonUrl={route('meta-data.index')}
    >
      <>
        <Card className='mt-5'>
          <CardHeader title='Groups' />
          <div className='p-2'>
            <StrongText>Part of no groups.</StrongText>
          </div>
        </Card>
        <Card className='mt-5'>
          <CardHeader title='Hierarchy' />
          <div className='p-2'>
            <StrongText>Not part of any hierarchy.</StrongText>
          </div>
        </Card>
      </>
    </ShowResourcePage>
  )
}
