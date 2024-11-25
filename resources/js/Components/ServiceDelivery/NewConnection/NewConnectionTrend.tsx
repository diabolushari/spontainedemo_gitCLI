import { useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'

export interface NewConnectionGraphValues {
  compl_beyond_sla__: number
  compl_beyond_sla_cnt: number
  compl_within_sla__: number
  compl_within_sla_cnt: number
  month_year: string
  pend_beyond_sla__: number
  pend_beyond_sla_cnt: number
  pend_within_sla__: number
  pend_within_sla_cnt: number
  sla_perf__: number
  sla_perf_cnt: number
  sla_svc_group: string
}

const dateEarlier = [
  '3 MONTHS',
  '4 MONTHS',
  '5 MONTHS',
  '6 MONTHS',
  '7 MONTHS',
  '8 MONTHS',
  '9 MONTHS',
  '10 MONTHS',
  '11 MONTHS',
  '12 MONTHS',
]

interface Properties {
  selectedMonth: Date | null
}
const NewConnectionTrend = ({ selectedMonth }: Properties) => {
  const [selectedValue, setSelectedValue] = useState('3 MONTHS')

  // Calculate months in the selected range
  const monthsInRange = (months: number): string[] => {
    const dates = []
    const date = new Date(selectedMonth)

    for (let i = 0; i < months; i++) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      dates.push(`${year}${month}`) // Format YYYYMM
      date.setMonth(date.getMonth() - 1) // Move one month backward
    }

    return dates
  }

  // Extract the range of months
  const selectedMonths = monthsInRange(parseInt(selectedValue.split(' ')[0]))

  // Convert months to match API format if needed
  const selectedMonthsParam = selectedMonths.join(',')
  const [graphValues] = useFetchRecord<{
    data: NewConnectionGraphValues[]
  }>(
    `subset/63?${selectedMonth == null ? 'latest=month_year' : `month_year=${selectedMonthsParam}`}`
  )

  // Filter and group data for the selected range
  const chartData = selectedMonths.map((month) => {
    const filteredValue = graphValues?.data.find((value) => value.month_year === month)
    return {
      month,
      RequestCompletedBeyondSla: filteredValue?.compl_beyond_sla_cnt || 0,
    }
  })

  console.log(chartData)

  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='flex w-11/12 flex-col gap-4 p-2'>
          <div className='flex'>
            <span className='small-1stop ml-10 items-end p-5'>Requests Completed beyond SLA</span>
            <div>
              <SelectList
                list={dateEarlier.map((month, index) => ({
                  key: index,
                  value: month,
                  text: month,
                }))}
                dataKey='value'
                displayKey='text'
                showAllOption
                value={selectedValue}
                setValue={setSelectedValue}
              />
            </div>
          </div>
          <div className='w-full'>
            <ResponsiveContainer
              width='100%'
              height={200}
            >
              <BarChart data={chartData}>
                <XAxis
                  dataKey='month'
                  tickFormatter={(month) => `${month.slice(4)}/${month.slice(0, 4)}`}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => value.toString()}
                  labelFormatter={(month) => month || 'Unknown'}
                />
                <Bar
                  dataKey='RequestCompletedBeyondSla'
                  fill='#235CC0'
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewConnectionTrend
