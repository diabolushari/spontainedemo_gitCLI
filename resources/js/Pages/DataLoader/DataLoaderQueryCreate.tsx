import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { DataLoaderConnection } from '@/interfaces/data_interfaces'

interface Props {
  connections: Pick<DataLoaderConnection, 'id' | 'name'>[]
  type?: string
  subtype?: string
}

export default function DataLoaderQueryCreate({ connections, type, subtype }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    name: '',
    description: '',
    connection_id: '',
    query: '',
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
      connection_id: {
        type: 'select',
        label: 'Connection',
        setValue: setFormValue('connection_id'),
        list: connections,
        displayKey: 'name',
        dataKey: 'id',
        allOptionText: 'Select a connection',
      },
      query: {
        type: 'textarea',
        label: 'Query',
        setValue: setFormValue('query'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, connections])

  return (
    <FormPage
      url={route('loader-queries.store')}
      formData={formData}
      formItems={formItems}
      title='Create Loader Query'
      backUrl={route('loader-queries.index', { type: 'loaders', subtype: 'queries' })}
      formStyles='w-1/2 md:grid-cols-1'
      buttonText='Save & Test'
      type={type}
      subtype={subtype}
    />
  )
}
