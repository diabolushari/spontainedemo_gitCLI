import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import useCustomForm from '@/hooks/useCustomForm'
import { MetaStructure } from '@/interfaces/meta_interfaces'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'

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
    search: '',
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
      },
    ] as ListItemKeys<Partial<MetaStructure>>[]
  }, [])

  //table data
  const data = useMemo(() => {
    return structures.data.map((structure) => {
      return {
        id: structure.id,
        structure_name: structure.structure_name,
        actions: [
          {
            title: `${structure.meta_data_count} Records`,
            url: route('meta-data.index', { structure: structure.id }, false),
          },
          {
            title: 'Edit',
            url: route('meta-structure.edit', structure.id, false),
          },
        ],
      }
    })
  }, [structures])

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
      type={type}
      subtype={subtype}
      oldValues={oldValues}
    />
  )
}
