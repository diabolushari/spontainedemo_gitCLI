import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { DataLoaderConnection } from '@/interfaces/data_interfaces'
import { databaseDrivers } from '@/Pages/DataLoader/DataLoaderConnectionCreate'

interface Props {
  dataLoaderConnection: DataLoaderConnection
}

export default function DataLoaderConnectionEdit({ dataLoaderConnection }: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    name: dataLoaderConnection.name,
    description: dataLoaderConnection.description,
    driver: dataLoaderConnection.driver,
    host: dataLoaderConnection.host,
    port: dataLoaderConnection.port,
    username: dataLoaderConnection.username,
    password: '',
    change_password: false,
    database: dataLoaderConnection.database,
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
      change_password: {
        type: 'checkbox',
        label: 'Change Password',
        setValue: toggleBoolean('change_password'),
      },
      password: {
        type: 'password',
        label: 'Password',
        setValue: setFormValue('password'),
        hidden: !formData.change_password,
      },
      database: {
        type: 'text',
        label: 'Database',
        setValue: setFormValue('database'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, formData.change_password])

  const customFormData = useMemo(() => {
    if (formData.change_password) {
      return {
        ...formData,
      }
    }
    return {
      ...formData,
      password: undefined,
    }
  }, [formData])

  return (
    <FormPage
      url={route('loader-connections.update', dataLoaderConnection.id)}
      formData={formData}
      formItems={formItems}
      title={`Edit ${dataLoaderConnection.name}`}
      backUrl={route('loader-connections.index')}
      formStyles='w-1/2 md:grid-cols-1'
      customSubmitData={customFormData}
      buttonText={'Update & Verify'}
      isPatchRequest
    />
  )
}
