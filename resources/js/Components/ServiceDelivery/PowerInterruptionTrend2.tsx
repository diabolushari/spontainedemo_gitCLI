import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { dateToYearMonth, formatNumber } from './ActiveConnection'
import { solidColors } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { CustomTooltip } from '../CustomTooltip'

interface ComplaintValues extends Model {
  complaint_count: number
  complaint_type: string
  month_year: string
}

interface Props {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}

const PowerInterruptionTrend2 = ({ selectedMonth, setSelectedMonth }: Props) => {
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
    if (
      selectedMonth?.getFullYear().toString() == yearFilter &&
      selectedMonth.getMonth().toString() == (Number(selectedRange) - 1).toString()
    ) {
      setSelectedRange((Number(selectedRange) - 1).toString())
    }
    setReferenceMonthYear(
      Number(selectedRange) < 10 ? yearFilter + '0' + selectedRange : yearFilter + selectedRange
    )
  }, [selectedRange, yearFilter, selectedMonth])

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

  const handleGraphSelection = useCallback(
    (data: { name: string | null }) => {
      router.get(
        route('data-explorer', {
          subsetGroup: 'Customer Complaints Summary',
          subset: 'Customer Complaints - All Types',
          month: dateToYearMonth(selectedMonth),
          complaint_type: data.name === 'Other' ? '' : data.name,
          route: route('service-delivery.index'),
        })
      )
    },
    [selectedMonth]
  )
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formattedLabel = `${label.slice(4)}/${label.slice(0, 4)}` // Format MM/YYYY
      const align = (name: string) => {
        const temp = name.replace('_', ' ')
        return `${temp[0].toUpperCase()}${temp.slice(1)}`
      }

      return (
        <div className='rounded-xl border-2 bg-white p-4 shadow-lg'>
          <div className='small-1stop mb-2 font-bold'>{formattedLabel}</div>
          <div className='flex flex-col'>
            {payload.map((value) => {
              return (
                <span
                  className={`small-1stop text-[${value.fill}]`}
                  key={value.name}
                >
                  {align(value.dataKey)}:
                  <span className='small-1stop font-bold'>{formatNumber(value.value)}</span>
                </span>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }
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
                content={({ payload }: LegendProps) => {
                  if (!payload) return null

                  return (
                    <ul
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        listStyle: 'none',
                        padding: 0,
                      }}
                    >
                      {payload.map((entry, index) => {
                        let formattedValue = entry.value

                        if (entry.value === 'current' && selectedMonth) {
                          const currentMonthName = monthList.find(
                            (m) => m.id === selectedMonth.getMonth() + 1
                          )?.name
                          const currentYear = selectedMonth.getFullYear()
                          formattedValue = `${currentMonthName}, ${currentYear}`
                        } else if (entry.value === 'previous') {
                          const previousMonthName = monthList.find(
                            (m) => m.id === Number(selectedRange)
                          )?.name
                          formattedValue = `${previousMonthName}, ${yearFilter}`
                        }

                        return (
                          <li
                            key={`item-${index}`}
                            style={{ marginRight: 10, fontSize: 8 }}
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                width: 10,
                                height: 10,
                                backgroundColor: entry.color,
                                marginRight: 5,
                                paddingTop: 1,
                              }}
                            />
                            {formattedValue}
                          </li>
                        )
                      })}
                    </ul>
                  )
                }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className='rounded-xl border-2 bg-white py-2'>
                        {label && <div className='small-1stop mx-2 mb-2 font-bold'>{label}</div>}

                        <div>
                          {payload.map((entry) => {
                            const rawValue = entry?.value
                            const name = entry?.name

                            let formattedName = name
                            let formattedValue = rawValue

                            if (name === 'current' && selectedMonth) {
                              const currentMonthName = monthList.find(
                                (m) => m.id === selectedMonth.getMonth() + 1
                              )?.name
                              const currentYear = selectedMonth.getFullYear()
                              formattedName = `${currentMonthName}, ${currentYear}`
                              formattedValue = formatNumber(rawValue)
                            } else if (name === 'previous') {
                              const previousMonthName = monthList.find(
                                (m) => m.id === Number(selectedRange)
                              )?.name
                              formattedName = `${previousMonthName}, ${yearFilter}`
                              formattedValue = formatNumber(rawValue)
                            } else {
                              formattedValue = formatNumber(rawValue)
                            }

                            return (
                              <div
                                className='flex w-full flex-col'
                                key={entry.dataKey || entry.name}
                              >
                                <div className='px-2'>
                                  <span className='small-1stop'>
                                    {formattedName} :{' '}
                                    <span className='small-1stop font-bold'>{formattedValue}</span>
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  }

                  return null
                }}
              />

              <Bar
                dataKey='current'
                fill={solidColors[0]}
                barSize={30}
                onClick={handleGraphSelection}
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
                onClick={handleGraphSelection}
              ></Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default PowerInterruptionTrend2
