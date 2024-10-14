import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { MetaDataGroup } from '@/interfaces/meta_interfaces'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'

interface Props {
  group: MetaDataGroup
}

export default function MetaGroupEdit({ group }: Props) {
  const { formData, setFormValue } = useCustomForm({
    name: group.name,
    description: group.description ?? '',
  })

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Meta group index',
      link: '/meta-data-group',
    },
    {
      item: 'Meta group ',
      link: route('meta-data-group.show', group.id),
    },
    {
      item: 'Meta group edit',
      link: '',
    },
  ]
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
      url={route('meta-data-group.update', group.id)}
      formData={formData}
      formItems={formItems}
      isPatchRequest
      title='Update Meta Data Group'
      backUrl={route('meta-data-group.index', { type: 'definitions', subtype: 'groups' })}
      formStyles='w-1/2 md:grid-cols-1'
      breadCrumbs={breadCrumb}
    />
  )
}
