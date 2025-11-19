import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import { DataClassificationProperty } from '@/interfaces/meta_interfaces'

interface Props {
  property: DataClassificationProperty
}

export default function DataClassificationPropertyEdit({ property }: Props) {
  const { formData, setFormValue } = useCustomForm({
    property_type: property.property_type,
    property_value: property.property_value,
    order: property.order,
  })

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Properties Index',
      link: route('data-classification-property.index'),
    },
    {
      item: 'Edit Property',
      link: '',
    },
  ]

  const formItems = useMemo(() => {
    return {
      property_type: {
        label: 'Property Type',
        type: 'text',
        setValue: setFormValue('property_type'),
      } as FormItem<string, never, never, never>,
      property_value: {
        label: 'Property Value',
        type: 'text',
        setValue: setFormValue('property_value'),
      } as FormItem<string, never, never, never>,
      order: {
        label: 'Order',
        type: 'number',
        setValue: setFormValue('order'),
      } as FormItem<number, never, never, never>,
    }
  }, [])

  return (
    <FormPage
      formItems={formItems}
      formData={formData}
      title={'Edit Classification Property'}
      url={route('data-classification-property.update', property.id)}
      backUrl={route('data-classification-property.index')}
      formStyles='md:w-1/2 md:grid-cols-1'
      isPatchRequest
      type={'definitions'}
      subtype={'blocks'}
      breadCrumbs={breadCrumb}
    />
  )
}
