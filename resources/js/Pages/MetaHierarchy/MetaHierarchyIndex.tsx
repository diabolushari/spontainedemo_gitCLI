import { Paginator } from '@/ui/ui_interfaces'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { useCallback, useMemo } from 'react'
import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { router } from '@inertiajs/react'

interface Props {
  hierarchies: Paginator<MetaHierarchy>
  type?: string
  subtype?: string
  oldValues?: Record<string, string>
}

export default function MetaHierarchyIndex({ hierarchies, type, subtype, oldValues }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
    type: 'definitions',
    subtype: 'heirarchies',
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
        placeholder: 'Search by hierarchy name',
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  const keys = useMemo(() => {
    return [
      {
        label: 'Hierarchy',
        key: 'name',
        isCardHeader: true,
        isLink: true,
      },
      {
        key: 'items_count',
        label: 'Members',
        isShownInCard: true,
        boxStyles: 'items-center',
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
          // {
          //   title: 'SHOW',
          //   url: route('meta-hierarchy.show', {
          //     metaHierarchy: hierarchy.id,
          //     type: 'definitions',
          //     subtype: 'heirarchies',
          //   }),
          // },
          // {
          //   title: 'EDIT',
          //   url: route('meta-hierarchy.edit', { id: hierarchy.id }),
          //   textStyles: 'ml-auto  hover:scale-105 transition',
          // },
        ],
      }
    })
  }, [hierarchies])
  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('meta-hierarchy.show', { id: id }))
  }, [])

  return (
    <ListResourcePage
      keys={keys}
      primaryKey='id'
      rows={data}
      formData={formData}
      formItems={formItems}
      paginator={hierarchies}
      title='Meta Hierarchies'
      addUrl={route('meta-hierarchy.create', { type: 'definitions', subtype: 'heirarchies' })}
      searchUrl={route('meta-hierarchy.index')}
      type={type ?? 'definitions'}
      subtype={subtype ?? 'hierarchies'}
      oldValues={oldValues}
      formStyles='bg-1stop-white p-4 rounded-lg'
      subheading={
        'Hierarchies can be particularly helpful when automatically drilling down or rolling up data. A hierarchy is a multi level,  "one parent to multiple children" structure'
      }
      handleCardClick={handleCardClick}
      cardStyles='p-4 '
    />
  )
}
