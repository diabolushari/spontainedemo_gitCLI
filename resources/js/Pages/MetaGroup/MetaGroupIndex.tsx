import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'
import { MetaDataGroup } from '@/interfaces/meta_interfaces'
import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'

interface Props {
  groups: Paginator<MetaDataGroup>
  type?: string
  subtype?: string
  oldValues?: Record<string, string>
}

export default function MetaGroupIndex({ groups, type, subtype, oldValues }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
    type: 'definitions',
    subtype: 'groups',
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
    return groups.data.map((group) => {
      return {
        id: group.id,
        items_count: group.items_count,
        name: group.name,
        actions: [
          {
            title: 'SHOW',
            url: route('meta-data-group.show', {
              metaDataGroup: group.id,
              type: 'definitions',
              subtype: 'groups',
            }),
          },
        ],
      }
    })
  }, [groups])
  console.log(data)
  const keys = useMemo(() => {
    return [
      {
        key: 'name',
        label: 'Name',
        isCardHeader: true,
      },
      {
        key: 'items_count',
        label: 'No. Of Items',
        isShownInCard: true,
      },
    ] as ListItemKeys<Partial<MetaDataGroup>>[]
  }, [])

  return (
    <ListResourcePage
      keys={keys}
      primaryKey='id'
      rows={data}
      formData={formData}
      formItems={formItems}
      addUrl={route('meta-data-group.create', { type: 'definitions', subtype: 'groups' })}
      title={'Meta Data Groups'}
      searchUrl={route('meta-data-group.index')}
      paginator={groups}
      type={type}
      subtype={subtype}
      oldValues={oldValues}
    />
  )
}
