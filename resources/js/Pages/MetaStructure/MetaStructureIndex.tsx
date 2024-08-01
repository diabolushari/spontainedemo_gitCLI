import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import useCustomForm from '@/hooks/useCustomForm'
import { MetaStructure } from '@/interfaces/meta_interfaces'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'

interface Props {
  structures: Paginator<MetaStructure>
}

interface FormFields {
  search: string
}

export default function MetaStructureIndex({ structures }: Props) {
  const { formData, setFormValue } = useCustomForm<FormFields>({
    search: '',
  })
  const formItems = useMemo(() => {
    return {
      search: {
        label: 'Search',
        type: 'text',
        setValue: setFormValue('search'),
      } as FormItem<string, never, never, never>,
    }
  }, [])

  const keys = useMemo(() => {
    return [
      {
        key: 'structure_name',
        label: 'Structure',
        isCardHeader: true,
      },
    ] as ListItemKeys<Partial<MetaStructure>>[]
  }, [])

  const data = useMemo(() => {
    return structures.data.map((structure) => {
      return {
        id: structure.id,
        structure_name: structure.structure_name,
        actions: [
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
      addButtonUrl={route('meta-structure.create')}
      searchUrl={route('meta-structure.index', undefined, false)}
      paginator={structures}
    />
  )
}
