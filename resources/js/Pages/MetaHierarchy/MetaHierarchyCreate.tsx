import useCustomForm from '@/hooks/useCustomForm'
import { useEffect, useMemo, useState } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import SelectList from '@/ui/form/SelectList'
import { MetaStructure } from '@/interfaces/meta_interfaces'

interface HeirachyLevel {
  level: number
  heirarchy_name: string
}

interface Properties {
  structures: Pick<MetaStructure, 'id' | 'structure_name'>[]
}
export default function MetaHierarchyCreate({ structures }: Properties) {
  const { formData, setFormValue } = useCustomForm({
    name: '',
    description: '',
    heirarchy_level: 1,
    heirachy_array: [] as HeirachyLevel[],
  })

  const [length, setLength] = useState<HeirachyLevel[]>([])

  useEffect(() => {
    const tempLength = []
    for (let i = 1; i <= formData.heirarchy_level; i++) {
      tempLength.push({ level: i, heirarchy_name: '' })
    }
    setLength(tempLength)
  }, [formData.heirarchy_level])

  useEffect(() => {
    setFormValue('heirachy_array')(length)
  }, [setFormValue, length])

  console.log(formData)
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
      heirarchy_level: {
        type: 'number',
        label: 'Heirarchy Level',
        setValue: setFormValue('heirarchy_level'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  const setHeirarchyValue = (item: HeirachyLevel, name: string) => {
    setLength((oldValues) => {
      return oldValues.map((tempValues) => {
        if (tempValues.level === item.level) {
          return { ...tempValues, heirarchy_name: name }
        }
        return tempValues
      })
    })
  }

  return (
    <FormPage
      url={route('meta-hierarchy.store')}
      formData={formData}
      formItems={formItems}
      title='Create Meta Hierarchy'
      backUrl={route('meta-hierarchy.index')}
      formStyles='w-1/2 md:grid-cols-1'
    >
      {length.map((item) => {
        return (
          <div
            className='flex flex-col'
            key={item.level}
          >
            <SelectList
              list={structures}
              setValue={(name) => setHeirarchyValue(item, name)}
              dataKey='structure_name'
              displayKey='structure_name'
              showAllOption
              value={item.heirarchy_name}
            />
          </div>
        )
      })}
    </FormPage>
  )
}
