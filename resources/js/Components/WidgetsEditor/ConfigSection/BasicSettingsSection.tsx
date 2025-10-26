import Input from '@/ui/form/Input'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
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
      <div className='flex flex-col'>
        <DynamicSelectList
          label='Data source'
          url='/api/data-detail'
          dataKey='id'
          displayKey='name'
          value={formData.data_table_id}
          setValue={setFormValue('data_table_id')}
        />
      </div>
      {formData.data_table_id != null && formData.data_table_id != '' && (
        <div className='flex flex-col'>
          <DynamicSelectList
            label='Subset group'
            url={`/api/data-detail/subset-group/${formData.data_table_id}`}
            dataKey='id'
            displayKey='name'
            value={formData.subset_group_id}
            setValue={setFormValue('subset_group_id')}
          />
        </div>
      )}
    </div>
  )
}
