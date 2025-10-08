import DynamicSelectList from '@/ui/form/DynamicSelectList'

export function RankingConfigSection({ formData, setFormValue }) {
  return (
    <div className='space-y-4 px-4'>
      <div>
        <DynamicSelectList
          label='Subset'
          url={`/api/subset-group/${formData?.subset_group_id}`}
          dataKey='subset_detail_id'
          displayKey='name'
          value={formData.rank_subset_id}
          setValue={setFormValue('rank_subset_id')}
        />
      </div>

      <div>
        <DynamicSelectList
          label={'Measure'}
          url={`/api/subset/${formData.rank_subset_id}?filter_only=0`}
          dataKey='subset_column'
          displayKey='subset_field_name'
          value={formData.rank_ranking_field}
          setValue={setFormValue('rank_ranking_field')}
        />
      </div>
    </div>
  )
}
