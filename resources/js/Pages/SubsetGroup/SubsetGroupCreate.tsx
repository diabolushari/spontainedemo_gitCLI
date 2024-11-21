import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { SubsetGroup } from '@/interfaces/data_interfaces'

interface Props {
  subsetGroup?: SubsetGroup
}

export default function SubsetGroupCreate({ subsetGroup }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    name: subsetGroup?.name ?? '',
    description: subsetGroup?.description ?? '',
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
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  return (
    <FormPage
      url={
        subsetGroup == null
          ? route('subset-groups.store')
          : route('subset-groups.update', subsetGroup.id)
      }
      formData={formData}
      formItems={formItems}
      title='Create SubsetGroup'
      backUrl={
        subsetGroup == null
          ? route('subset-groups.index')
          : route('service-delivery.show', subsetGroup.id)
      }
      formStyles='w-1/2 md:grid-cols-1'
      isPatchRequest={subsetGroup != null}
    />
  )
}
