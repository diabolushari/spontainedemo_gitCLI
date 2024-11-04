import { SubsetDetail } from '@/interfaces/data_interfaces'
import { SubsetFieldItem } from '@/Pages/Subset/SubsetTablePage'
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import CheckBox from '@/ui/form/CheckBox'

interface Props {
  subset: SubsetDetail
  fields: SubsetFieldItem[]
  setFields: Dispatch<SetStateAction<SubsetFieldItem[]>>
}

export default function SubsetColumnsFilter({ subset, fields, setFields }: Readonly<Props>) {
  useEffect(() => {
    const newFieldList: SubsetFieldItem[] = []
    subset.dates?.map((dateField) => {
      newFieldList.push({
        id: dateField.id as number,
        name: dateField.info?.field_name ?? '',
        checked: true,
      })
    })

    subset.measures?.map((measureField) => {
      newFieldList.push({
        id: measureField.id as number,
        name: measureField.info?.field_name ?? '',
        checked: true,
      })
    })

    subset.dimensions?.map((dimensionField) => {
      newFieldList.push({
        id: dimensionField.id as number,
        name: dimensionField.info?.field_name ?? '',
        checked: true,
      })
    })

    setFields(newFieldList)
  }, [subset, setFields])

  const toggleField = useCallback(
    (id: number) => {
      setFields((prevState) => {
        return prevState.map((field) => {
          if (field.id === id) {
            return {
              ...field,
              checked: !field.checked,
            }
          }
          return field
        })
      })
    },
    [setFields]
  )

  return (
    <div className='flex flex-col gap-5'>
      {fields.map((field) => (
        <div
          className='flex flex-col'
          key={field.id}
        >
          <CheckBox
            label={field.name}
            value={field.checked}
            toggleValue={() => toggleField(field.id)}
          />
        </div>
      ))}
    </div>
  )
}
