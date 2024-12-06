import { useEffect, useMemo, useState } from 'react'
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  LabelList,
} from 'recharts'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useFetchRecord from '@/hooks/useFetchRecord'
import SelectList from '@/ui/form/SelectList'
import { Model } from '@/interfaces/data_interfaces'
import { monthList } from '@/libs/dates'
import { formatNumber } from './ActiveConnection'
import { solidColors } from '@/ui/ui_interfaces'

interface ComplaintValues extends Model {
  complaint_count: number
  complaint_type: string
  month_year: string
}

const PowerInterruptionTrend2 = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [monthYear, setMonthYear] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [yearList, setYearList] = useState<{ yearName: string }[]>([])
  const [graphValues] = useFetchRecord<{ latest_value: string }>(`subset/72?latest=month_year`)
  const [yearFilter, setYearFilter] = useState('')
  const [referenceMonthYear, setReferenceMonthYear] = useState('')
  const [selectedRange, setSelectedRange] = useState('')
  useEffect(() => {
    setSelectedRange(`${(Number(graphValues?.latest_value) % 100) - 1}`)
    setReferenceMonthYear(`${Number(graphValues?.latest_value) - 1}`)
    setYearFilter(`${Math.trunc(Number(graphValues?.latest_value) / 100)}`)
  }, [graphValues?.latest_value])

  useEffect(() => {
    setReferenceMonthYear(
      Number(selectedRange) < 10 ? yearFilter + '0' + selectedRange : yearFilter + selectedRange
    )
  }, [setReferenceMonthYear, selectedRange, yearFilter])
  useEffect(() => {
    for (let i = new Date().getFullYear(); i >= 2017; i--) {
      setYearList((prev) => [
        ...prev,
        {
          yearName: `${i}`,
        },
      ])
    }
    const i = new Date().getFullYear()
    setYearFilter(`${i}`)
  }, [])

  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
  useEffect(() => {
    if (selectedMonth != null) {
      setMonthYear(
        `${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`
      )
    }
  }, [selectedMonth])

  const [chartData] = useFetchRecord<{ data: ComplaintValues[]; latest_value: string }>(
    `subset/72?month_year=${monthYear}`
  )

  const [referenceData] = useFetchRecord<{ data: ComplaintValues[]; latest_value: string }>(
    `subset/72?month_year=${referenceMonthYear}`
  )

  const comparedData = useMemo(() => {
    return [
      {
        name: 'Power Failures',
        current:
          chartData?.data.find((value) => value.complaint_type == 'NO POWER SUPPLY')
            ?.complaint_count ?? 0,
        previous:
          referenceData?.data.find((value) => value.complaint_type == 'NO POWER SUPPLY')
            ?.complaint_count ?? 0,
      },
      {
        name: 'Voltage Related',
        current:
          chartData?.data.find((value) => value.complaint_type == 'VOLTAGE RELATED')
            ?.complaint_count ?? 0,
        previous:
          referenceData?.data.find((value) => value.complaint_type == 'VOLTAGE RELATED')
            ?.complaint_count ?? 0,
      },
      {
        name: 'Service Connection Related',
        current:
          chartData?.data.find((value) => value.complaint_type == 'SERVICE CONNECTION RELATED')
            ?.complaint_count ?? 0,
        previous:
          referenceData?.data.find((value) => value.complaint_type == 'SERVICE CONNECTION RELATED')
            ?.complaint_count ?? 0,
      },
    ]
  }, [chartData, referenceData])

  const isLoading = !chartData || chartData?.data.length === 0

  return (
    <div className='flex w-full flex-col gap-2 p-3'>
      <span className='subheader-sm-1stop text-end'>
        {selectedMonth !== null && (
          <>
            Complaint volumes for{' '}
            {monthList.find((value) => value.id == selectedMonth.getMonth() + 1)?.name},
            {selectedMonth.getFullYear()} compared with..
          </>
        )}
      </span>
      <div className='flex flex-row justify-end gap-2'>
        <div>
          <SelectList
            setValue={setYearFilter}
            list={yearList}
            displayKey='yearName'
            dataKey='yearName'
            value={yearFilter}
            style='1stop-small'
          />
        </div>
        <div>
          <SelectList
            list={monthList}
            dataKey='id'
            displayKey='name'
            value={selectedRange}
            setValue={setSelectedRange}
            style='1stop-small'
          />
        </div>
      </div>
      <div className='w-full'>
        {isLoading ? (
          <Skeleton
            height={200}
            width='100%'
          />
        ) : (
          <ResponsiveContainer
            height={200}
            width='100%'
          >
            <BarChart
              layout='vertical'
              width={600}
              height={600}
              data={comparedData}
            >
              <XAxis
                type='number'
                axisLine={false}
                display='none'
                padding={{ left: 0, right: 0 }}
              />
              <YAxis
                type='category'
                axisLine={false}
                display='none'
                height={10}
                width={120}
                dataKey='name'
                padding={{ top: 50 }}
              />
              <Legend
                formatter={(value) => {
                  if (value === 'current' && selectedMonth) {
                    const currentMonthName = monthList.find(
                      (m) => m.id === selectedMonth.getMonth() + 1
                    )?.name
                    const currentYear = selectedMonth.getFullYear()
                    return `${currentMonthName}, ${currentYear}`
                  }

                  if (value === 'previous') {
                    const previousMonthName = monthList.find(
                      (m) => m.id === Number(selectedRange)
                    )?.name
                    return `${previousMonthName}, ${yearFilter}`
                  }

                  return value
                }}
              />

              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'current' && selectedMonth) {
                    const currentMonthName = monthList.find(
                      (m) => m.id === selectedMonth.getMonth() + 1
                    )?.name
                    const currentYear = selectedMonth.getFullYear()
                    return [`${formatNumber(value)} `, `${currentMonthName}, ${currentYear}`]
                  }

                  if (name === 'previous') {
                    const previousMonthName = monthList.find(
                      (m) => m.id === Number(selectedRange)
                    )?.name
                    return [`${formatNumber(value)} `, `${previousMonthName}, ${yearFilter}`]
                  }

                  return [formatNumber(value), name]
                }}
              />

              <Bar
                dataKey='current'
                fill={solidColors[0]}
                barSize={30}
              >
                <LabelList
                  dataKey='name'
                  position='left'
                  fill='#262626'
                  fontSize={10}
                  dx={-10}
                />
              </Bar>
              <Bar
                dataKey='previous'
                fill={solidColors[1]}
                barSize={30}
              ></Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default PowerInterruptionTrend2
