import { useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'
import ToogleNumber from '@/Components/ui/ToogleNumber'
import TooglePercentage from '@/Components/ui/TogglePercentage'

export interface SlaTrendValues {
  month_year: string
  sla_perf_count: number
  sla_perf_perc: number
  sla_svc_group: string
}

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date>>
}
const SlaTrend = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [toogleValue, setToogleValue] = useState<boolean>(true)
  const [selectedValue, setSelectedValue] = useState('3 MONTHS')
  const [title, setTitle] = useState('Ownership change') // Selected `sla_svc_group`

  const handleToogleChange = () => {
    setToogleValue(!toogleValue)
  }
  // Fetch the graph values
  const [graphValues] = useFetchRecord<{
    data: SlaTrendValues[]
    month: number
    year: number
    latest_value: string
  }>(
    `subset/78?${
      selectedMonth == null
        ? 'latest=month_year'
        : `month_year=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`
    }`
  )
  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
  // Options for the date range dropdown
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

  // Generate month-year range
  const monthsInRange = (months: number): string[] => {
    const dates = []
    const date = new Date(selectedMonth || new Date())

    for (let i = 0; i < months; i++) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      dates.push(`${year}${month}`) // Format YYYYMM
      date.setMonth(date.getMonth() - 1)
    }

    return dates
  }

  const selectedMonths = monthsInRange(parseInt(selectedValue.split(' ')[0]))

  // Filter and prepare chart data
  const chartData = selectedMonths.map((month) => {
    const filteredValues = graphValues?.data.filter(
      (value) => value.sla_svc_group === title && value.month_year === month
    )
    const slaPerfCount = toogleValue
      ? filteredValues?.[0]?.sla_perf_count || 0
      : filteredValues?.[0]?.sla_perf_perc || 0

    return { month, sla_perf_count: slaPerfCount }
  })

  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='flex w-11/12 flex-col gap-4 p-2'>
          <div className='flex'>
            <div className='p-5'>
              <button onClick={handleToogleChange}>
                {toogleValue ? <ToogleNumber /> : <TooglePercentage />}
              </button>
            </div>

            <div className='p-5'>
              <SelectList
                setValue={setTitle}
                list={graphValues?.data ?? []}
                displayKey='sla_svc_group'
                dataKey='sla_svc_group'
                showAllOption
                value={title}
              />
            </div>
            <div className='p-5'>
              <SelectList
                list={dateEarlier.map((month, index) => ({
                  key: index,
                  value: month,
                  text: month,
                }))}
                dataKey='value'
                displayKey='text'
                showAllOption={false}
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
              <AreaChart data={chartData}>
                <XAxis
                  dataKey='month'
                  tickFormatter={
                    (month) => `${month.slice(4)}/${month.slice(0, 4)}` // Format YYYYMM to MM/YYYY
                  }
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `${value}`,
                    toogleValue ? 'SLA Perf Count' : 'SLA Perf %',
                  ]}
                  labelFormatter={
                    (month) => `${month.slice(4)}/${month.slice(0, 4)}` // Format tooltip label
                  }
                />
                <Area
                  type='monotone'
                  dataKey='sla_perf_count'
                  stroke='#0091ff'
                  fill='#0091ff'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlaTrend
