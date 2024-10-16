import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { MetaStructure } from '@/interfaces/meta_interfaces'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'

interface Props {
  metaStructure: MetaStructure
  pageNo: string
}

export default function MetaStructureEdit({ metaStructure, pageNo }: Props) {
  const { formData, setFormValue } = useCustomForm({
    structure_name: metaStructure.structure_name,
    description: metaStructure.description ?? '',
  })
  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Meta structure index',
      link: '/meta-structure?page=' + pageNo,
    },
    {
      item: 'Meta structure',
      link: route('meta-structure.show', { metaStructure: metaStructure.id, page: pageNo }),
    },
    {
      item: 'Meta structure edit',
      link: '',
    },
  ]

  const formItems = useMemo(() => {
    return {
      structure_name: {
        label: 'Structure Name',
        type: 'text',
        setValue: setFormValue('structure_name'),
      } as FormItem<string, never, never, never>,
      description: {
        label: 'Description',
        type: 'textarea',
        setValue: setFormValue('description'),
      } as FormItem<string, never, never, never>,
    }
  }, [])

  return (
    <FormPage
      formItems={formItems}
      formData={formData}
      title={'Update Meta Structure'}
      url={route('meta-structure.update', { id: metaStructure.id, page: pageNo })}
      backUrl={route('meta-structure.show', { metaStructure: metaStructure.id, page: pageNo })}
      formStyles='md:w-1/2  md:grid-cols-1'
      isPatchRequest
      type={'definitions'}
      subtype={'blocks'}
      breadCrumbs={breadCrumb}
    />
  )
}
