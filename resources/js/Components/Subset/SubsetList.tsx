import CardGridView from '@/Components/ListingPage/CardGridView'
import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { DataDetail, SubsetDetail } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import { useCallback, useMemo } from 'react'

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
        use_for_training_ai: subset.use_for_training_ai === 1 ? 'Yes' : 'No',
        actions: [],
      }
    })
  }, [subsets])

  const keys = useMemo(() => {
    return [
      {
        key: 'name',
        isShownInCard: true,
      },
      {
        key: 'use_for_training_ai',
        isShownInCard: true,
        label: 'Used for Training AI',
      },
    ] as ListItemKeys<{ name: string; use_for_training_ai: string }>[]
  }, [])

  const onAddClick = () => {
    // console.log('here')
    router.get(route('subset.create', { dataDetail: detail.id }))
    // router.get(`subset/create/${detail.id}`)
  }

  const onCardClick = useCallback((id: number | string) => {
    router.get(route('subset.preview', id))
  }, [])

  return (
    <CardGridView
      keys={keys}
      primaryKey='id'
      rows={data}
      onAddClick={onAddClick}
      layoutStyles='lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'
      onCardClick={onCardClick}
    />
  )
}
