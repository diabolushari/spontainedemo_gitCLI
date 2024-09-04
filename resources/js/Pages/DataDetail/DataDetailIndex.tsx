import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { DataDetail } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import { useMemo } from 'react'

interface Props {
  details: Paginator<DataDetail>
}

export default function DataDetailIndex({ details }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
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
        label: 'Search',
        setValue: setFormValue('search'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  const data = useMemo(() => {
    return details.data.map((detail) => {
      return {
        id: detail.id,
        name: detail.name,
        is_active: detail.is_active === 1 ? 'Yes' : 'No',
        actions: [
          {
            title: 'Show',
            url: route('data-detail.show', { id: detail.id }),
          },
        ],
      }
    })
  }, [details])

  const keys = useMemo(() => {
    return [
      { key: 'name', label: 'Name', isCardHeader: true },
      { key: 'is_active', label: 'Is Active', isShownInCard: true },
    ] as ListItemKeys<{
      name: string
      is_active: string
    }>[]
  }, [])

  return (
    <ListResourcePage
      formData={formData}
      formItems={formItems}
      keys={keys}
      rows={data}
      paginator={details}
      searchUrl={route('data-detail.index')}
      addUrl={route('data-detail.create')}
      primaryKey='id'
    />
  )
}
