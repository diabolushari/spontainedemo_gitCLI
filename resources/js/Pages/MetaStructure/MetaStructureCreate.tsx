import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'

interface Properties {
  type?: string
  subtype?: string
}

export default function MetaStructureCreate({ type, subtype }: Properties) {
  const { formData, setFormValue } = useCustomForm({
    structure_name: '',
    description: '',
  })

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
      title={'Create Meta Structure'}
      url={route('meta-structure.store')}
      backUrl={route('meta-structure.index', { type: 'definitions', subtype: 'blocks' })}
      formStyles='md:w-1/2  md:grid-cols-1'
      type={'definitions'}
      subtype={'blocks'}
    />
  )
}
