import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { MetaData, MetaStructure } from '@/interfaces/meta_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useCallback, useMemo, useState } from 'react'

interface Props {
  structures: Partial<MetaStructure>[]
  metaData: Paginator<MetaData>
  type?: string
  subtype?: string
  oldValues?: Record<string, string>
}

export default function MetaDataIndex({ structures, metaData, type, subtype, oldValues }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
    structure: '',
    type: 'definitions',
    subtype: 'metadata',
  })

  const [selectedItem, setSelectedItem] = useState<Pick<
    MetaStructure,
    'id' | 'structure_name'
  > | null>(null)

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
        placeholder: 'Search for a metadata value..',
      },
      structure: {
        type: 'autocomplete',
        label: 'Meta Structure',
        autoCompleteSelection: selectedItem,
        dataKey: 'id',
        displayKey: 'structure_name',
        linkText: 'Structural blocks',
        placeholder: 'Limit to structural block..',
        redirectLink: route('meta-structure.index'),
        selectListUrl: route('meta-structure-search', {
          search: '',
        }),
        setValue: (value: Pick<MetaStructure, 'id' | 'structure_name'>) => {
          setSelectedItem(value)
          setFormValue('structure')(value?.structure_name ?? '')
        },
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, selectedItem])

  const data = useMemo(() => {
    return metaData.data.map((metaData) => ({
      id: metaData.id,
      name: metaData.meta_structure?.structure_name + ' : ' + metaData.name,
      structure: metaData.meta_structure?.structure_name,
      actionStyle: 'gap-8',
      actions: [
        {
          title: 'Groups ' + metaData.group_item_count,
          url: route('meta-data-group.index', { search: metaData.name }),
          textStyles: ' hover:scale-105 transition',
        },
        {
          title:
            'Hierarchies ' +
            ((metaData.hierarchy_primary_field_count ?? 0) +
              (metaData.hierarchy_secondary_field_count ?? 0)),
          url: route('meta-hierarchy.index', { search: metaData.name }),
          textStyles: 'ml-auto  hover:scale-105 transition',
        },
      ],
    }))
  }, [metaData])

  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('meta-data.show', { metaData: id, page: metaData.current_page }))
  }, [])

  const keys = useMemo(() => {
    return [
      { key: 'name', label: 'Name', isCardHeader: true, isLink: true },
      // { key: 'structure', label: 'Structure', isShownInCard: true, boxStyles: 'col-span-full' },
      // { key: 'groups', label: 'Groups', isShownInCard: true, boxStyles: 'link' },
      // { key: 'hierarchies', label: 'Hierarchies', isShownInCard: true, boxStyles: 'justify-end' },
    ] as ListItemKeys<Partial<MetaData>>[]
  }, [])

  return (
    <ListResourcePage
      keys={keys}
      primaryKey='id'
      rows={data}
      formData={formData}
      formItems={formItems}
      addUrl={route('meta-data.create')}
      title={'Metadata'}
      searchUrl={route('meta-data.index')}
      type={type ?? 'definitions'}
      subtype={subtype ?? 'metadata'}
      oldValues={oldValues}
      paginator={metaData}
      formStyles='bg-1stop-white p-4 rounded-lg'
      subheading='Metadata elements that will form valid reporting dimension. Each metdata element will be a distinct value of a structural block.
e.g: "Yellow" is a valid dimensional value of a structural block called "Colour"'
      handleCardClick={handleCardClick}
      gridStyles='grid-cols-2'
      cardStyles='p-4'
    />
  )
}
