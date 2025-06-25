import useCustomForm from '@/hooks/useCustomForm'
import Input from '@/ui/form/Input'
import CheckBox from '@/ui/form/CheckBox'

export default function ConfigFormMeasureFields({ measureField }: { measureField: any }) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    label: measureField.label,
    value: measureField.value,
    unit: measureField.unit,
    show_label: measureField.show_label,
  })

  return (
    <>
      <form>
        <div className='flex flex-col gap-4 md:grid md:grid-cols-4'>
          <div className='flex flex-col'>
            <Input
              label='Label'
              value={formData.label}
              setValue={setFormValue('label')}
            />
          </div>
          <div className='flex flex-col'>
            <Input
              label='Value'
              value={formData.value}
              setValue={setFormValue('value')}
            />
          </div>
          <div className='flex flex-col'>
            <Input
              label='Unit'
              value={formData.unit}
              setValue={setFormValue('unit')}
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
      </form>
    </>
  )
}
