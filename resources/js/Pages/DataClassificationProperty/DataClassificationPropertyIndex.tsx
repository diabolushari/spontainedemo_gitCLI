import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import useCustomForm from '@/hooks/useCustomForm'
import { DataClassificationProperty } from '@/interfaces/meta_interfaces'
import { useCallback, useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'

interface Props {
  properties: Paginator<DataClassificationProperty>
}

export default function DataClassificationPropertyIndex({ properties }: Props) {
  const { formData, setFormValue } = useCustomForm({
    search: '',
  })

  const formItems = useMemo(() => {
    return {
      search: {
        label: 'Search',
        type: 'text',
        setValue: setFormValue('search'),
        placeholder: 'Search by type or value',
      } as FormItem<string, never, never, never>,
    }
  }, [setFormValue])

  const keys = useMemo(() => {
    return [
      {
        key: 'property_type',
        label: 'Type',
        isCardHeader: true,
      },
      {
        key: 'property_value',
        label: 'Value',
        isShownInCard: true,
      },
      {
        key: 'order',
        label: 'Order',
        isShownInCard: true,
      },
    ] as ListItemKeys<Partial<DataClassificationProperty>>[]
  }, [])

  const data = useMemo(() => {
    return properties.data.map((property) => {
      return {
        id: property.id,
        property_type: property.property_type,
        property_value: property.property_value,
        order: property.order,
        actions: [
          {
            title: 'Edit',
            url: route('data-classification-property.edit', property.id),
            textStyles: 'hover:scale-105 transition',
          },
        ],
      }
    })
  }, [properties])

  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('data-classification-property.show', id))
  }, [])

  return (
    <ListResourcePage
      keys={keys}
      primaryKey={'id'}
      rows={data}
      formData={formData}
      formItems={formItems}
      addUrl={route('data-classification-property.create')}
      searchUrl={route('data-classification-property.index')}
      paginator={properties}
      type={'definitions'} 
      subtype={'blocks'}
      formStyles='bg-1stop-white p-4 rounded-lg'
      title='Data Classification Properties'
      subheading='Manage classification properties like Level, Category, Encryption, etc.'
      cardStyles='p-4'
      handleCardClick={handleCardClick}
    />
  )
}
