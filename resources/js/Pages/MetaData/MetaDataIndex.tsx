import { MetaData, MetaStructure } from '@/interfaces/meta_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import { Paginator } from '@/ui/ui_interfaces'
import { useMemo } from 'react'
import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { FormItem } from '@/FormBuilder/FormBuilder'

interface Props {
  structures: Partial<MetaStructure>[]
  metaData: Paginator<MetaData>
}

export default function MetaDataIndex({ structures, metaData }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
    structure: '',
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
      structure: {
        type: 'select',
        dataKey: 'id',
        displayKey: 'structure_name',
        label: 'Structure',
        list: structures,
        setValue: setFormValue('structure'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, structures])

  const data = useMemo(() => {
    return metaData.data.map((metaData) => ({
      id: metaData.id,
      name: metaData.name,
      actions: [
        {
          title: 'Show',
          url: route('meta-data.show', { id: metaData.id }),
        },
      ],
    }))
  }, [metaData])

  const keys = useMemo(() => {
    return [{ key: 'name', label: 'Name', isCardHeader: true }] as ListItemKeys<Partial<MetaData>>[]
  }, [])

  return (
    <ListResourcePage
      keys={keys}
      primaryKey='id'
      rows={data}
      formData={formData}
      formItems={formItems}
      addButtonUrl={route('meta-data.create')}
      title={'Meta Data'}
      searchUrl={route('meta-data.index')}
    />
  )
}
