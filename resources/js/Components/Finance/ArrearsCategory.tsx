import Card from '@/ui/Card/Card'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link, router } from '@inertiajs/react'
import { useCallback, useEffect, useState } from 'react'
import MoreButton from '../MoreButton'
import DataShowIcon from '../ui/DatashowIcon'
import useFetchRecord from '@/hooks/useFetchRecord'
import SelectList from '@/ui/form/SelectList'
import { Cat } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Skeleton from 'react-loading-skeleton'
import { CustomTooltip } from '../CustomTooltip'
import { solidColors } from '@/ui/ui_interfaces'
import { Legend } from '@headlessui/react'
import { CustomLegend } from './TotalCollected'
import { dateToYearMonth } from '../ServiceDelivery/ActiveConnection'
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
    ConsumerCategory: value.consumer_category,
    TotalArrears: value.total_arrears,
    DisputedArrears: value.disputed_arrears,
    UndisputedArrears: value.undisputed_arrears,
  }))
  const handleGraphSelection = useCallback(
    (data: { name: string | null }) => {
      router.get(
        route('data-explorer', {
          subsetGroup: 'Arrears Comparison',
          voltage: selectedVoltageType,
          month: dateToYearMonth(selectedMonth),
          consumer_category: data.name === 'Other' ? '' : data.name,
          route: route('finance.index'),
        })
      )
    },
    [selectedVoltageType, selectedMonth]
  )
  return (
    <div className='flex w-full flex-col '>
      {/* <div className='small-1stop-header flex w-14 flex-col rounded-2xl'>
          <button
            className={`flex w-full rounded-tl-2xl border border-white px-2 py-4 ${selectedLevel === 1 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(1)
            }}
          >
            <DataShowIcon />
          </button>
          <button
            className={`border px-2 py-7 ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(2)
            }}
          >
            <p></p>
          </button>
          <button
            className={`border px-2 py-7 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
              setSelectedLevel(3)
            }}
          >
            <p></p>
          </button>
          <button
            className={`border px-2 py-7 ${selectedLevel === 4 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
            }}
          >
            <p></p>
          </button>
          <button
            className={`px-2 py-7 ${selectedLevel === 5 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('section_code')
              // setLevelCode(level?.record.section_code ?? '')
            }}
          >
            <p></p>
          </button>
        </div> */}
      <div className='flex-col'>
        <div className='mt-4 flex w-full gap-2 p-2 pt-5'>
          <span className='subheader-sm-1stop'>Arrears By Category</span>
          <div className='justify-end pl-10'>
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
        <div className='p-5'>
          {chartData?.length ? (
            <ResponsiveContainer
              height={150}
              width='100%'
            >
              <BarChart
                width='100%'
                height={150}
                data={chartData}
              >
                <XAxis dataKey='ConsumerCategory' />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey='TotalArrears'
                  fill={solidColors[0]}
                  onClick={handleGraphSelection}
                />

                <Bar
                  dataKey='UndisputedArrears'
                  fill={solidColors[1]}
                  onClick={handleGraphSelection}
                />
                <Bar
                  dataKey='DisputedArrears'
                  fill={solidColors[2]}
                  onClick={handleGraphSelection}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton
              width={1000}
              height={150}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ArrearsCategory
