import { useCallback, useEffect, useState } from 'react'

import useFetchRecord from '@/hooks/useFetchRecord'
import SelectList from '@/ui/form/SelectList'

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import Skeleton from 'react-loading-skeleton'
import { CustomTooltip } from '../CustomTooltip'
import { solidColors } from '@/ui/ui_interfaces'
import { CustomLegend } from './TotalCollected'
import { dateToYearMonth, formatNumber } from '../ServiceDelivery/ActiveConnection'
import { router } from '@inertiajs/react'
export interface ArrearsCategoryValues {
  month: string
  consumer_category: string
  disputed_arrears: number
  total_arrears: number
  undisputed_arrears: number
  voltage: string
}
interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}
const renderCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // const formattedLabel = `${label.slice(4)}/${label.slice(0, 4)}` // Format MM/YYYY
    const align = (name: string) => {
      const temp = name.replace('_', ' ')
      return `${temp[0].toUpperCase()}${temp.slice(1)}`
    }

    return (
      <div className='rounded-xl border-2 bg-white p-4 shadow-lg'>
        <div className='small-1stop mb-2 font-bold'>{label}</div>
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
const customizedGroupTick = ({ index, x, y, payload }: any) => {
  const label = payload.value
  return (
    <g>
      <g>
        <text
          x={x}
          y={y}
          dy={16}
          textAnchor='end'
          className='axial-label-1stop'
        >
          {label[0].toUpperCase()}
          {label.slice(1).toLowerCase()}
        </text>
      </g>
    </g>
  )
}
const ArrearsCategory = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [selectedVoltageType, setSelectedVoltageType] = useState('LT')
  const [graphValues] = useFetchRecord<{ data: ArrearsCategoryValues[]; latest_value: string }>(
    `subset/181?${selectedMonth == null ? 'latest=month' : `month=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}`
  )

  const voltageType = ['LT', 'HT']

  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])

  const filteredValues = graphValues?.data.filter((value) => value.voltage === selectedVoltageType)

  const chartData = filteredValues?.map((value) => ({
    consumer_category: value.consumer_category,
    total_arrears: value.total_arrears,
    disputed_arrears: value.disputed_arrears,
    undisputed_arrears: value.undisputed_arrears,
  }))
  const handleGraphSelection = useCallback(
    (data: { consumer_category: string | null }) => {
      router.get(
        route('data-explorer', {
          subsetGroup: 'Arrears Comparison',
          subset: 'Arrears Analysis - Category-wise',
          voltage: selectedVoltageType,
          month: dateToYearMonth(selectedMonth),
          consumer_category: data.consumer_category === 'Other' ? '' : data.consumer_category,
          route: route('finance.index'),
        })
      )
    },
    [selectedVoltageType, selectedMonth]
  )
  return (
    <div className='flex w-full flex-col'>
      <div className='flex-col'>
        <div className='mt-2 flex w-full flex-col justify-end gap-2 p-3'>
          <span className='subheader-sm-1stop text-end'>Arrears By Category</span>

          <div className='flex flex-row justify-end gap-2'>
            <div>
              <SelectList
                list={voltageType.map((voltage) => ({
                  key: voltage,
                  value: voltage,
                  text: voltage,
                }))}
                dataKey='value'
                displayKey='text'
                showAllOption={true}
                value={selectedVoltageType}
                setValue={setSelectedVoltageType}
                style='1stop-small'
              />
            </div>
          </div>
        </div>
        <div className='p-5'>
          {chartData?.length ? (
            <ResponsiveContainer
              height={150}
              width='100%'
            >
              <BarChart
                // width='100%'
                height={150}
                data={chartData}
              >
                <XAxis
                  dataKey='consumer_category'
                  tick={customizedGroupTick}
                />
                <YAxis hide />
                <Tooltip content={renderCustomTooltip} />
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
                          if (entry.value === 'total_arrears') formattedValue = 'TOTAL ARREARS'
                          else if (entry.value === 'disputed_arrears')
                            formattedValue = 'DISPUTED ARREARS'
                          else if (entry.value === 'undisputed_arrears')
                            formattedValue = 'UNDISPUTED ARREARS'

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
                  align='center'
                />

                <Bar
                  dataKey='total_arrears'
                  fill={solidColors[0]}
                  onClick={handleGraphSelection}
                />

                <Bar
                  dataKey='undisputed_arrears'
                  fill={solidColors[1]}
                  onClick={handleGraphSelection}
                />
                <Bar
                  dataKey='disputed_arrears'
                  fill={solidColors[2]}
                  onClick={handleGraphSelection}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton
              width='100%'
              height={150}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ArrearsCategory
