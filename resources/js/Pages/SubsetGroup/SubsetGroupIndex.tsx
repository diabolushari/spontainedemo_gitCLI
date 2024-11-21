import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import useCustomForm from '@/hooks/useCustomForm'
import { SubsetGroup } from '@/interfaces/data_interfaces'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'

interface Props {
  subsetGroups: Paginator<SubsetGroup>
}

interface FormFields {
  search: string
}

export default function SubsetGroupIndex({ subsetGroups }: Readonly<Props>) {
  //holds data
  const { formData, setFormValue } = useCustomForm<FormFields>({
    search: '',
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
        key: 'name',
        label: 'Name',
        isCardHeader: true,
      },
    ] as ListItemKeys<Partial<SubsetGroup>>[]
  }, [])

  //table data
  const data = useMemo(() => {
    return subsetGroups.data.map((record) => {
      return {
        id: record.id,
        name: record.name,
        actions: [
          {
            title: 'Show',
            url: route('subset-groups.show', record.id),
          },
        ],
      }
    })
  }, [subsetGroups])

  return (
    <ListResourcePage
      keys={keys}
      primaryKey={'id'}
      rows={data}
      formData={formData}
      formItems={formItems}
      addUrl={route('subset-groups.create')}
      searchUrl={route('subset-groups.index')}
      paginator={subsetGroups}
    />
  )
}
