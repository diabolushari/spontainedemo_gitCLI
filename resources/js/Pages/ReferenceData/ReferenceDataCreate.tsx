import FormPage from '@/FormBuilder/FormPage'
import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { ReferenceDataDomain } from '@/interfaces/data_interfaces'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'

interface Props {
  domains: ReferenceDataDomain[]
}

const ReferenceDataCreate = ({ domains }: Props) => {
  const { formData, setFormValue } = useCustomForm({
    domain_id: '',
    parameter_id: '',
    sort_order: '',
    value_one: '',
    value_two: '',
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
  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Reference Data index',
      link: route('reference-data.index', { type: 'config', subtype: 'reference-data' }),
    },
    {
      item: 'Reference Data create',
      link: '',
    },
  ]

  return (
    <FormPage
      formItems={formItems}
      formData={formData}
      title='Create Reference Data'
      url={route('reference-data.store')}
      backUrl={route('reference-data.index', { type: 'config', subtype: 'reference-data' })}
      type='config'
      subtype='reference-data'
      breadCrumbs={breadCrumb}
    />
  )
}

export default ReferenceDataCreate
