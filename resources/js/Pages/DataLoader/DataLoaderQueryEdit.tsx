import FormPage from '@/FormBuilder/FormPage'
import { DataLoaderConnection, DataLoaderQuery } from '@/interfaces/data_interfaces'
import { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'

interface Props {
  dataLoaderQuery: DataLoaderQuery
  connections: Pick<DataLoaderConnection, 'id' | 'name'>[]
}

export default function DataLoaderQueryEdit({ dataLoaderQuery, connections }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    name: dataLoaderQuery.name,
    description: dataLoaderQuery.description ?? '',
    connection_id: dataLoaderQuery.connection_id.toString(),
    query: dataLoaderQuery.query,
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
      url={route('loader-queries.update', dataLoaderQuery.id)}
      formData={formData}
      formItems={formItems}
      title='Edit Query'
      backUrl={route('loader-queries.index')}
      formStyles='w-1/2 md:grid-cols-1'
      isPatchRequest
      buttonText='Update & Test'
    />
  )
}
