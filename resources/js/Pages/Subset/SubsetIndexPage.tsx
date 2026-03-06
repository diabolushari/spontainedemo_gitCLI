import { Paginator } from '@/ui/ui_interfaces'
import { DataDetail, SubsetDetail } from '@/interfaces/data_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import { useCallback, useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'

interface Props {
  subsets: Paginator<SubsetDetail>
  dataDetails: Pick<DataDetail, 'id' | 'name'>[]
  oldSearch: string
  oldType: string
  oldUsedForTrainingAI: string
}

const trainingOptions = [
  { name: 'Used', value: 'true' },
  { name: 'Not Used', value: 'false' },
]

export default function SubsetIndexPage({
  subsets,
  dataDetails,
  oldSearch,
  oldType,
  oldUsedForTrainingAI,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    search: oldSearch,
    type: oldType,
    used_for_training_ai: oldUsedForTrainingAI,
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      search: {
        type: 'text',
        placeholder: 'Search by name',
        label: 'Search',
        setValue: setFormValue('search'),
      },
      type: {
        type: 'select',
        label: 'Data Table',
        list: dataDetails,
        displayKey: 'name',
        dataKey: 'id',
        showAllOption: true,
        allOptionText: 'All',
        setValue: setFormValue('type'),
      },
      used_for_training_ai: {
        type: 'select',
        label: 'Usage By AI',
        list: trainingOptions,
        displayKey: 'name',
        dataKey: 'value',
        setValue: setFormValue('used_for_training_ai'),
        allOptionText: 'All',
        showAllOption: true,
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, dataDetails])

  const data = useMemo(() => {
    return subsets.data.map((subset) => {
      return {
        id: subset.id,
        name: subset.name,
        use_for_training_ai: subset.use_for_training_ai === 1 ? 'Yes' : 'No',
        data_table: subset.data_detail?.name ?? '',
        actions: [],
      }
    })
  }, [subsets])

  const keys = useMemo(() => {
    return [
      {
        key: 'name',
        label: 'Name',
        isCardHeader: true,
      },
      {
        key: 'use_for_training_ai',
        label: 'Use for Training AI',
        isShownInCard: true,
      },
      {
        key: 'data_table',
        label: 'Data Table',
        isShownInCard: true,
      },
    ] as ListItemKeys<{
      name: string
      use_for_training_ai: string
      data_table: string
    }>[]
  }, [])

  const handleCardClick = useCallback((id: number | string) => {
    window.open(route('subset.preview', id), '_blank')
  }, [])

  return (
    <ListResourcePage
      formData={formData}
      formItems={formItems}
      keys={keys}
      rows={data}
      paginator={subsets}
      searchUrl={route('subsets')}
      primaryKey='id'
      type='data'
      subtype='subsets'
      formStyles='bg-1stop-white p-4 rounded-lg'
      title='Subets'
      handleCardClick={handleCardClick}
      subheading={``}
      isAddButton={false}
    />
  )
}
