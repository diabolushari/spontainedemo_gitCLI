import { Paginator } from '@/ui/ui_interfaces'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { useMemo } from 'react'
import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'

interface Props {
  hierarchies: Paginator<MetaHierarchy>
}

export default function MetaHierarchyIndex({ hierarchies }: Props) {
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

  const keys = useMemo(() => {
    return [
      {
        label: 'Hierarchy',
        key: 'name',
        isCardHeader: true,
      },
      {
        key: 'items_count',
        label: 'No. of items',
        isShownInCard: true,
      },
    ] as ListItemKeys<{ name: string; items_count: number }>[]
  }, [])

  const data = useMemo(() => {
    return hierarchies.data.map((hierarchy) => {
      return {
        id: hierarchy.id,
        name: hierarchy.name,
        items_count: hierarchy.items_count ?? 0,
        actions: [
          {
            title: 'SHOW',
            url: route('meta-hierarchy.show', { id: hierarchy.id }),
          },
          {
            title: 'EDIT',
            url: route('meta-hierarchy.edit', { id: hierarchy.id }),
          },
        ],
      }
    })
  }, [hierarchies])

  return (
    <ListResourcePage
      keys={keys}
      primaryKey='id'
      rows={data}
      formData={formData}
      formItems={formItems}
      paginator={hierarchies}
      title='Meta Hierarchies'
      addButtonUrl={route('meta-hierarchy.create')}
      searchUrl={route('meta-hierarchy.index')}
    />
  )
}
