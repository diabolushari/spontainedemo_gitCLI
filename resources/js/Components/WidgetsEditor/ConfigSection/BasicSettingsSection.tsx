import Input from '@/ui/form/Input'
import { WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'

interface BasicSettingsSectionProps {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
}

export default function BasicSettingsSection({
  formData,
  setFormValue,
}: Readonly<BasicSettingsSectionProps>) {
  return (
    <div className='flex flex-col gap-4 px-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <Input
            label='Widget title'
            value={formData.title}
            setValue={setFormValue('title')}
          />
        </div>
        <div className='flex flex-col'>
          <Input
            label='Widget subtitle'
            value={formData.subtitle}
            setValue={setFormValue('subtitle')}
          />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <Input
            label='Description'
            value={formData.description}
            setValue={setFormValue('description')}
          />
        </div>
        <div className='flex flex-col'>
          <Input
            label='View Details Link'
            value={formData.link}
            setValue={setFormValue('link')}
          />
        </div>
      </div>
    </div>
  )
}
