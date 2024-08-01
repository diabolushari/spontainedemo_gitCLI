import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { ReferenceData, ReferenceDataDomain } from '@/interfaces/data_interfaces'

interface Props {
  domains: ReferenceDataDomain[]
  referenceData: ReferenceData
}

const ReferenceDataEdit = ({ domains, referenceData }: Props) => {
  const { formData, setFormValue } = useCustomForm({
    domain_id: referenceData.domain_id.toString(),
    parameter_id: referenceData.parameter_id.toString(),
    sort_order: referenceData.sort_order.toString(),
    value_one: referenceData.value_one,
    value_two: referenceData.value_two ?? '',
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      domain_id: {
        label: 'Domain',
        type: 'select',
        setValue: setFormValue('domain_id'),
        list: domains,
        displayKey: 'domain',
        dataKey: 'id',
      },
      parameter_id: {
        label: 'Parameter',
        type: 'dynamicSelect',
        setValue: setFormValue('parameter_id'),
        displayKey: 'parameter',
        dataKey: 'id',
        selectListUrl: route('parameter-list', {
          domain: formData.domain_id,
        }),
      },
      sort_order: {
        label: 'Position',
        type: 'text',
        setValue: setFormValue('sort_order'),
      },
      value_one: {
        label: 'Value',
        type: 'text',
        setValue: setFormValue('value_one'),
      },
      value_two: {
        label: 'Value Two',
        type: 'text',
        setValue: setFormValue('value_two'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, domains, formData.domain_id])

  return (
    <FormPage
      formItems={formItems}
      formData={formData}
      title='Update Reference Data'
      url={route('reference-data.update', referenceData.id)}
      backUrl={route('reference-data.index')}
      isPatchRequest
    />
  )
}

export default ReferenceDataEdit
