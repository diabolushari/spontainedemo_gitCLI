import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { DataLoaderJob } from '@/interfaces/data_interfaces'


interface Props {
  dataLoaderJob: DataLoaderJob
}

export default function DataLoaderJobEdit({ dataLoaderJob }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    //fields
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      //fields
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  return (
    <FormPage
      url={route('loader-jobs.update', dataLoaderJob.id)}
      formData={formData}
      formItems={formItems}
      title='Edit DataLoaderJob'
      backUrl={route('loader-jobs.show', dataLoaderJob.id)}
      formStyles='w-1/2 md:grid-cols-1'
      isPatchRequest
      type='loaders'
      subtype='jobs'
    />
  )
}
