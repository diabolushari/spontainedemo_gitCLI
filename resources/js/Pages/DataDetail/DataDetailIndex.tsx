import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { DataDetail, ReferenceData } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useCallback, useMemo } from 'react'

interface Props {
  details: Paginator<DataDetail>
  types: ReferenceData[]
}

export default function DataDetailIndex({ details, types }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
    type: '',
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
        label: 'Type',
        list: types,
        displayKey: 'value_one',
        dataKey: 'value_one',
        showAllOption: true,
        allOptionText: 'Select Type',
        setValue: setFormValue('type'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, types])

  const data = useMemo(() => {
    return details.data.map((detail) => {
      return {
        id: detail.id,
        type: detail.subject_area,
        name: detail.name,
        tableName: detail.table_name,
        actions: [],
      }
    })
  }, [details])

  const keys = useMemo(() => {
    return [
      { key: 'name', label: 'Name', isCardHeader: true },
      { key: 'type', isShownInCard: true, hideLabel: false },
      { key: 'tableName', isShownInCard: true, hideLabel: false },
    ] as ListItemKeys<{
      id: number
      name: string
      type: string
      tableName: string
    }>[]
  }, [])

  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('data-detail.show', { id: id }))
  }, [])

  return (
    <ListResourcePage
      formData={formData}
      formItems={formItems}
      keys={keys}
      rows={data}
      paginator={details}
      searchUrl={route('data-detail.index', { type: 'data', subtype: 'data-tables' })}
      addUrl={route('data-detail.create')}
      primaryKey='id'
      type='data'
      subtype='data-tables'
      formStyles='bg-1stop-white p-4 rounded-lg'
      title='Data Tables'
      handleCardClick={handleCardClick}
      cardStyles='p-4 hover:scale-105 transition'
      subheading={`Data tables contain data in report-ready formats.  Data tables contain dimensions (including data dates), and measures/metrics`}
    />
  )
}
