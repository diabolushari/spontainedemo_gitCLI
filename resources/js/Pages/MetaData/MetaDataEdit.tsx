import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { MetaData, MetaStructure } from '@/interfaces/meta_interfaces'
import FormPage from '@/FormBuilder/FormPage'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'

interface Props {
  metaData: MetaData
  structures: Pick<MetaStructure, 'id' | 'structure_name'>[]
}

export default function MetaDataEdit({ metaData, structures }: Props) {
  const { formData, setFormValue } = useCustomForm({
    name: metaData.name,
    description: metaData.description,
    meta_structure_id: metaData.meta_structure_id.toString(),
  })
  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Meta data index',
      link: '/meta-data',
    },
    {
      item: 'Meta data ',
      link: route('meta-data.show', metaData.id),
    },
    {
      item: 'Meta data edit',
      link: '',
    },
  ]
  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      name: {
        type: 'text',
        label: 'Search',
        setValue: setFormValue('name'),
      },
      description: {
        type: 'textarea',
        label: 'Description',
        setValue: setFormValue('description'),
      },
      meta_structure_id: {
        type: 'select',
        dataKey: 'id',
        displayKey: 'structure_name',
        label: 'Structure',
        list: structures,
        setValue: setFormValue('meta_structure_id'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, structures])

  return (
    <FormPage
      url={route('meta-data.update', metaData.id)}
      formData={formData}
      formItems={formItems}
      title={'Update Meta Data'}
      backUrl={route('meta-data.show', metaData.id)}
      isPatchRequest
      type='definitions'
      subtype='metadata'
      breadCrumbs={breadCrumb}
    />
  )
}
