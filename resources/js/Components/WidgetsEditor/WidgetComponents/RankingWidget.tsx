import RankedList from '@/Components/Dashboard/SampleDashboard/RankedList'

export default function RankingWidget({ formData, selectedMonth }) {
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${year}${month}`
  if (!formData.rank_subset_id || !formData.rank_ranking_field) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-gray-500'>No data</div>
      </div>
    )
  } else {
    return (
      <div>
        <RankedList
          subsetId={formData.rank_subset_id}
          dataField={formData.rank_ranking_field}
          dataFieldName={formData.rank_ranking_field}
          rankingPageUrl={'#'}
          timePeriod={formattedMonth}
          timePeriodFieldName={'month'}
        />
      </div>
    )
  }
}
