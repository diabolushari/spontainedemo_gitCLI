import { useEffect } from 'react'
import Input from '@/ui/form/Input'
import CheckBox from '@/ui/form/CheckBox'
import useCustomForm from '@/hooks/useCustomForm'

export default function ConfigFormMeasureFields({
  field,
  isSelected,
  data,
  onUpdate,
  errors,
}: {
  isSelected: boolean
  field: any
  data: {
    value: string
    label: string
    unit: string
    show_label: boolean
  }
  onUpdate: (data: {
    value: string
    label: string
    unit: string
    show_label: boolean
    selected: boolean
  }) => void
  errors?: any
}) {
  const { formData, setFormValue, toggleBoolean, setAll } = useCustomForm({
    field: isSelected,
    label: data.label,
    value: data.value,
    unit: data.unit,
    show_label: data.show_label,
  })

  useEffect(() => {
    setAll({
      field: isSelected,
      label: data.label,
      value: data.value,
      unit: data.unit,
      show_label: data.show_label,
    })
  }, [data.label, data.value, data.unit, data.show_label, isSelected])

  // 🔁 Sync external parent with current field state
  useEffect(() => {
    onUpdate({
      label: formData.label,
      value: formData.value,
      unit: formData.unit,
      show_label: formData.show_label,
      selected: formData.field,
    })
  }, [formData.label, formData.value, formData.unit, formData.show_label, formData.field])

  return (
    <div className='flex flex-col gap-4 md:grid md:grid-cols-4'>
      <div className='col-span-4 flex flex-col'>
        <CheckBox
          label={field.subset_field_name}
          value={formData.field}
          toggleValue={toggleBoolean('field')}
        />
      </div>
      {formData.field && (
        <>
          <div className='flex flex-col'>
            <Input
              label='Label'
              value={formData.label}
              setValue={setFormValue('label')}
              error={errors?.label}
            />
          </div>
          <div className='flex flex-col'>
            <Input
              label='Value'
              value={formData.value}
              setValue={() => {}}
              disabled={true}
            />
          </div>
          <div className='flex flex-col'>
            <Input
              label='Unit'
              value={formData.unit}
              setValue={setFormValue('unit')}
              error={errors?.unit}
            />
          </div>
          <div className='flex flex-col'>
            <CheckBox
              label='Show Label'
              value={formData.show_label}
              toggleValue={toggleBoolean('show_label')}
              error={errors?.show_label}
            />
          </div>
        </>
      )}
    </div>
  )
}
;``
