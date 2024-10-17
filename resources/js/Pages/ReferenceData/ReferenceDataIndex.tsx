import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { ReferenceData, ReferenceDataDomain } from '@/interfaces/data_interfaces'
import { Paginator } from '@/ui/ui_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import { useCallback, useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { router } from '@inertiajs/react'

interface Props {
  referenceData: Paginator<ReferenceData>
  domains: ReferenceDataDomain[]
  oldDomain: string
  oldParameter: string
  oldValue: string
}

const cols = ['Domain', 'Parameter', 'Position', 'Value One', 'Value Two']

const ReferenceDataIndex = ({
  referenceData,
  domains,
  oldDomain,
  oldValue,
  oldParameter,
}: Props) => {
  const { formData, setFormValue } = useCustomForm({
    domain_id: oldDomain,
    parameter_id: oldParameter,
    value: oldValue,
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
      value: {
        label: 'Value',
        type: 'text',
        setValue: setFormValue('value'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, domains, formData.domain_id])

  const data = useMemo(() => {
    return referenceData.data.map((row) => {
      return {
        id: row.id,
        domainParameter: `${row.domain} (${row.parameter})`,
        sort_order: row.sort_order,
        value_one: row.value_one,
        value_two: row.value_two ? 'Value 2: ' + row.value_two : '',
        actions: [
          {
            title: 'Edit',
            url: route('reference-data.edit', row.id, false),
            textStyles: 'hover:scale-105 transition',
          },
        ],
      }
    })
  }, [referenceData])

  const keys = useMemo(() => {
    return [
      {
        key: 'value_one',
        label: 'Domain',
        isCardHeader: true,
      },
      {
        key: 'domainParameter',
        label: 'Parameter',
        isShownInCard: true,
        hideLabel: true,
      },
      {
        key: 'sort_order',
        label: 'Position',
      },
      {
        key: '',
        isShownInCard: true,
        boxStyles: 'items-center gap-0',
      },
      {
        key: 'value_two',
        isShownInCard: true,
        boxStyles: 'items-center gap-0',
      },
    ] as ListItemKeys<Partial<ReferenceData>>[]
  }, [])
  // const handleCardClick = useCallback((id: number | string) => {
  //   router.get(route('reference-data.show', { id: id }))
  // }, [])
  return (
    <ListResourcePage
      rows={data}
      keys={keys}
      primaryKey={'id'}
      title='Reference Data'
      paginator={referenceData}
      formItems={formItems}
      formData={formData}
      searchUrl={route('reference-data.index', { type: 'config', subtype: 'reference-data' })}
      addUrl={route('reference-data.create')}
      type='config'
      subtype='reference-data'
      formStyles='bg-1stop-white p-4 rounded-lg'
      // handleCardClick={handleCardClick}
      cardStyles='p-4 '
      subheading='Reference data is a flexible list of data elements used to populate dynamic selection lists, basic rule sets etc.'
    />
  )
}

export default ReferenceDataIndex
