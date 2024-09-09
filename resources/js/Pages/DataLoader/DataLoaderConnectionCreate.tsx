import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { DataLoaderJob } from '@/interfaces/data_interfaces'

export const databaseDrivers = [
  { value: 'mysql', label: 'MySQL' },
  { value: 'pgsql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'sqlsrv', label: 'SQL Server' },
  { value: 'mariadb', label: 'MariaDB' },
]

interface Props {
  job: DataLoaderJob
}

export default function DataLoaderConnectionCreate() {
  const { formData, setFormValue } = useCustomForm({
    name: '',
    description: '',
    driver: 'mysql',
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
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
      driver: {
        type: 'select',
        label: 'Driver',
        list: databaseDrivers,
        displayKey: 'label',
        dataKey: 'value',
        setValue: setFormValue('driver'),
      },
      host: {
        type: 'text',
        label: 'Host',
        setValue: setFormValue('host'),
      },
      port: {
        type: 'text',
        label: 'Port',
        setValue: setFormValue('port'),
      },
      username: {
        type: 'text',
        label: 'Username',
        setValue: setFormValue('username'),
      },
      password: {
        type: 'password',
        label: 'Password',
        setValue: setFormValue('password'),
      },
      database: {
        type: 'text',
        label: 'Database',
        setValue: setFormValue('database'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  return (
    <FormPage
      url={route('loader-connections.store')}
      formData={formData}
      formItems={formItems}
      title='Create DataLoaderConnection'
      backUrl={route('loader-connections.index')}
      formStyles='w-1/2 md:grid-cols-1'
    />
  )
}
