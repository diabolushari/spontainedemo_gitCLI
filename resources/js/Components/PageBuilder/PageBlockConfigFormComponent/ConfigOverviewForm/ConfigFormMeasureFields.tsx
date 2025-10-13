import { useEffect } from 'react'
import Input from '@/ui/form/Input'
import CheckBox from '@/ui/form/CheckBox'
import useCustomForm from '@/hooks/useCustomForm'

export default function ConfigFormField({
  field,
  isSelected,
  data,
  onUpdate,
  errors,
}: Readonly<{
  isSelected: boolean
  field: {
    subset_field_name: string
    id?: string
    type?: string
    description?: string
  }
  data: {
    value: string
    label: string
    unit?: string
    show_label: boolean
  }
  onUpdate: (data: {
    value: string
    label: string
    unit?: string
    show_label: boolean
    selected: boolean
  }) => void
  errors?: any
  showUnit?: boolean
}>) {
  const { formData, setFormValue, toggleBoolean, setAll } = useCustomForm({
    selected: isSelected,
    label: data.label,
    value: data.value,
    unit: data.unit || '',
    show_label: data.show_label,
  })

  useEffect(() => {
    setAll({
      selected: isSelected,
      label: data.label,
      value: data.value,
      unit: data.unit || '',
      show_label: data.show_label,
    })
  }, [data.label, data.value, data.unit, data.show_label, isSelected])

  useEffect(() => {
    onUpdate({
      label: formData.label,
      value: formData.value,
      unit: formData.unit,
      show_label: formData.show_label,
      selected: formData.selected,
    })
  }, [formData.label, formData.value, formData.unit, formData.show_label, formData.selected])

  return (
    <div className='flex flex-col gap-2 border-b pb-2'>
      <CheckBox
        label={field.subset_field_name}
        value={formData.selected}
        toggleValue={toggleBoolean('selected')}
      />

      {formData.selected && (
        <div className='mt-2 grid grid-cols-2 gap-2'>
          <div className='flex flex-col'>
            <Input
              label='Label'
              value={formData.label}
              setValue={setFormValue('label')}
              error={errors?.label}
            />
          </div>

          <div className='flex flex-col'>
            <CheckBox
              label='Show Label'
              value={formData.show_label}
              toggleValue={toggleBoolean('show_label')}
            />
          </div>
        </div>
      )}
    </div>
  )
}
