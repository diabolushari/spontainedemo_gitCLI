import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { DataDetail, ReferenceData, SubjectArea } from '@/interfaces/data_interfaces'

interface Props {
  subjectAreas: Pick<SubjectArea, 'id' | 'name'>[]
  types: ReferenceData[]
  dataDetail: DataDetail
}

export default function DataDetailEdit({ types, dataDetail }: Props) {
  const { formData, setFormValue } = useCustomForm({
    name: dataDetail.name,
    description: dataDetail.description ?? '',
    subject_area: dataDetail.subject_area ?? '',
    is_active: dataDetail.is_active === 1,
  })

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
        label: 'Name',
        setValue: setFormValue('name'),
      },
      description: {
        type: 'textarea',
        label: 'Description',
        setValue: setFormValue('description'),
      },
      subject_area: {
        type: 'select',
        label: 'Subject Area',
        list: types,
        displayKey: 'value_one',
        dataKey: 'value_two',
        showAllOption: true,
        allOptionText: 'Select Type',
        setValue: setFormValue('subject_area'),
      },
      is_active: {
        type: 'checkbox',
        label: 'Is Active',
        setValue: setFormValue('is_active'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  return (
    <FormPage
      url={route('data-detail.store')}
      formData={formData}
      formItems={formItems}
      title='Create Data Detail'
      backUrl={route('data-detail.index', { type: 'data', subtype: 'data-tables' })}
      formStyles='w-1/2 md:grid-cols-1'
      type='data'
      subtype='data-tables'
    />
  )
}
