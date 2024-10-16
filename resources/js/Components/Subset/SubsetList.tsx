import CardGridView from '@/Components/ListingPage/CardGridView'
import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { DataDetail, SubsetDetail } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import { useMemo } from 'react'

interface Props {
  detail: DataDetail
  subsets: SubsetDetail[]
}

export default function SubsetList({ detail, subsets }: Readonly<Props>) {
  const data = useMemo(() => {
    return subsets.map((subset) => {
      return {
        id: subset.id,
        name: subset.name,
        actions: [],
      }
    })
  }, [subsets])

  const keys = useMemo(() => {
    return [
      {
        key: 'name',
        isShownInCard: true,
        boxStyles: 'mr-auto',
      },
    ] as ListItemKeys<{ name: string }>[]
  }, [])

  const onAddClick = () => {
    router.get(route('subset.create', { dataDetail: detail.id }))
  }

  return (
    <CardGridView
      keys={keys}
      primaryKey='id'
      rows={data}
      onAddClick={onAddClick}
      layoutStyles='lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'
    />
  )
}
