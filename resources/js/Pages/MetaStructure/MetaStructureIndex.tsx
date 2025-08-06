import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import useCustomForm from '@/hooks/useCustomForm'
import { MetaStructure } from '@/interfaces/meta_interfaces'
import { useCallback, useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'

interface Props {
  structures: Paginator<MetaStructure>
  type?: string
  subtype?: string
  oldValues?: Record<string, string>
}

// interface FormFields {
//   search: string
// }

export default function MetaStructureIndex({ structures, type, subtype, oldValues }: Props) {
  //holds data
  const { formData, setFormValue } = useCustomForm({
    search: oldValues?.search ?? '',
    type: 'definitions',
    subtype: 'blocks',
  })

  //input elements list
  const formItems = useMemo(() => {
    return {
      search: {
        label: 'Search',
        type: 'text',
        setValue: setFormValue('search'),
        placeholder: 'Search by structure name',
      } as FormItem<string, never, never, never>,
    }
  }, [setFormValue])

  // keys(table col titles) for the table
  const keys = useMemo(() => {
    return [
      {
        key: 'structure_name',
        label: 'Structure',
        isCardHeader: true,
        isLink: true,
      },
      {
        key: 'description',
        isShownInCard: true,
        boxStyles: 'gap-0 line-clamp-1',
        textStyles: 'small-1stop',
      },
    ] as ListItemKeys<Partial<MetaStructure>>[]
  }, [])

  //table data
  const data = useMemo(() => {
    return structures.data.map((structure) => {
      return {
        id: structure.id,
        structure_name: structure.structure_name,
        description: structure.description,
        actions: [
          {
            title: `Members ${structure.meta_data_count}`,
            url: route('meta-data.index', { structure: structure.id }, false),
            textStyles: 'hover:scale-105 transition',
          },
          // {
          //   title: 'Edit',
          //   url: route('meta-structure.edit', structure.id, false),
          //   textStyles: 'ml-auto  hover:scale-105 transition',
          // },
        ],
      }
    })
  }, [structures])
  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('meta-structure.show', { metaStructure: id, page: structures.current_page }))
  }, [])

  return (
    <ListResourcePage
      keys={keys}
      primaryKey={'id'}
      rows={data}
      formData={formData}
      formItems={formItems}
      addUrl={route('meta-structure.create', { type: 'definitions', subtype: 'blocks' })}
      searchUrl={route('meta-structure.index')}
      paginator={structures}
      type={type ?? 'definitions'}
      subtype={subtype ?? 'blocks'}
      oldValues={oldValues}
      formStyles='bg-1stop-white p-4 rounded-lg'
      title='Structural Blocks'
      subheading='Each metdata element will be a distinct value of a structural block.
e.g: "Yellow" is a valid dimensional value of a structural block called "Colour".'
      cardStyles='p-4'
      handleCardClick={handleCardClick}
    />
  )
}
