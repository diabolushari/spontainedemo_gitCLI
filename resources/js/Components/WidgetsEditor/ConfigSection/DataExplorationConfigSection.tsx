import DynamicSelectList from '@/ui/form/DynamicSelectList'
import { WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'

interface DataExplorationConfigSectionProps {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
}

export default function DataExplorationConfigSection({
  formData,
  setFormValue,
}: Readonly<DataExplorationConfigSectionProps>) {
  return (
    <div className='flex flex-col gap-4 px-4'>
      <div className='flex flex-col'>
        <DynamicSelectList
          label='Explore Subset Group'
          url={`/api/data-detail/subset-group/${formData.data_table_id}`}
          dataKey='name'
          displayKey='name'
          value={formData.explore_subset_group_name}
          setValue={setFormValue('explore_subset_group_name')}
        />
      </div>
      <div className='flex flex-col'>
        <DynamicSelectList
          label='Ranking Subset Group'
          url={`/api/data-detail/subset-group/${formData.data_table_id}`}
          dataKey='name'
          displayKey='name'
          value={formData.rank_subset_group_name}
          setValue={setFormValue('rank_subset_group_name')}
        />
      </div>
    </div>
  )
}
