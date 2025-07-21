import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { DataLoaderAPI } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useCallback, useMemo } from 'react'

interface Props {
  dataLoaderAPIs: Paginator<DataLoaderAPI>
  type?: string
  subtype?: string
  oldValues?: Record<string, string>
}

interface FormFields {
  search: string
}

export default function DataLoaderAPIIndex({ dataLoaderAPIs, oldValues }: Readonly<Props>) {
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
      {
        key: 'url',
        label: 'URL',
        isShownInCard: true,
        hideLabel: true,
      },
    ] as ListItemKeys<Partial<DataLoaderAPI>>[]
  }, [])

  //table data
  const data = useMemo(() => {
    return dataLoaderAPIs.data.map((record) => {
      return {
        id: record.id,
        name: record.name,
        url: record.url,
        actions: [],
      }
    })
  }, [dataLoaderAPIs])

  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('loader-apis.show', id))
  }, [])

  return (
    <ListResourcePage
      keys={keys}
      title={'JSON APIs'}
      primaryKey={'id'}
      rows={data}
      formData={formData}
      formItems={formItems}
      type={'loaders'}
      subtype={'json-apis'}
      addUrl={route('loader-apis.create')}
      searchUrl={route('loader-apis.index')}
      paginator={dataLoaderAPIs}
      handleCardClick={handleCardClick}
    />
  )
}
