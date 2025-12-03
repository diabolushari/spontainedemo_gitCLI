import DynamicSelectList from '@/ui/form/DynamicSelectList'
import { WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'

interface DataSourceSelectSectionProps {
  formData: WidgetFormData
  handleDataTableChange: (value: string) => void
  handleSubsetGroupChange: (value: string) => void
}

export default function DataSourceSelectSection({
  formData,
  handleDataTableChange,
  handleSubsetGroupChange,
}: Readonly<DataSourceSelectSectionProps>) {
  return (
    <div className='flex flex-col gap-4 px-4'>
      <div className='flex flex-col'>
        <DynamicSelectList
          label='Data source'
          url='/api/data-detail'
          dataKey='id'
          displayKey='name'
          value={formData.data_table_id}
          setValue={handleDataTableChange}
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
            setValue={handleSubsetGroupChange}
          />
        </div>
      )}
    </div>
  )
}
