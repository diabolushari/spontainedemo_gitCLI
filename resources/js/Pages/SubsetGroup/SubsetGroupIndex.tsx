import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import useCustomForm from '@/hooks/useCustomForm'
import { SubsetGroup } from '@/interfaces/data_interfaces'
import { useCallback, useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'

interface Props {
  subsetGroups: Paginator<SubsetGroup>
  type?: string
  subtype?: string
  oldValues?: Record<string, string>
}

interface FormFields {
  search: string
}

export default function SubsetGroupIndex({ subsetGroups, oldValues }: Readonly<Props>) {
  //holds data
  const { formData, setFormValue } = useCustomForm<FormFields>({
    search: oldValues?.search ?? '',
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
        actions: [],
      }
    })
  }, [subsetGroups])

  const onCardClick = useCallback((id: string | number) => {
    router.get(route('subset-groups.show', id))
  }, [])

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
      handleCardClick={onCardClick}
      type='data'
      subtype='subject-area'
      title='Subset Groups'
    />
  )
}
