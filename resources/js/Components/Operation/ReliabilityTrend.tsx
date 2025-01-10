import useFetchRecord from '@/hooks/useFetchRecord'
import { dateToYearMonth, formatNumber } from '../ServiceDelivery/ActiveConnection'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { solidColors } from '@/ui/ui_interfaces'
import Skeleton from 'react-loading-skeleton'
import { useCallback } from 'react'
import { router } from '@inertiajs/react'

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}
interface RelliabilityTrendValues {
  month: string
  total_interruption_duration__h_: number
  interruption_duration___urban__h_: number
  interruption_duration___rural__h_: number
  total_interruptions: number
  interruptions___urban_: number
  interruptions___rural: number
}
const renderCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-xl border-2 bg-white p-4 shadow-lg'>
        <div className='small-1stop mb-2 font-bold'>{label}</div>
        <div>
          {payload.map((entry, index) => {
            const dataKey = entry.dataKey
            return (
              <p
                key={`tooltip-${index}`}
                style={{ color: entry.color }}
                className='small-1stop'
              >
                {`${dataKey}:`}
                <span className='small-1stop font-bold'>{formatNumber(entry.value)}</span>
              </p>
            )
          })}
        </div>
      </div>
    )
  }
  return null
}

const ReliabilityTrend = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [graphValues] = useFetchRecord<{
    data: RelliabilityTrendValues[]
    latest_value: string
  }>(
    `subset/345?${selectedMonth == null ? 'latest=month' : `month=${dateToYearMonth(selectedMonth)}`}`
  )
  const interruptionDurationRural = graphValues?.data.reduce(
    (sum, record) => sum + record.interruption_duration___rural__h_,
    0
  )
  const interruptionRural = graphValues?.data.reduce(
    (sum, record) => sum + record.interruptions___rural,
    0
  )
  const interruptionDurationUrban = graphValues?.data.reduce(
    (sum, record) => sum + record.interruption_duration___urban__h_,
    0
  )
  const interruptionUrban = graphValues?.data.reduce(
    (sum, record) => sum + record.interruptions___urban_,
    0
  )
  const interruptionDurationData = [
    { name: 'Interruption Duration ', interruptionDurationUrban, interruptionDurationRural },
  ]

  const interruptionData = [{ name: 'Interruption ', interruptionUrban, interruptionRural }]

  const handleGraphSelection = useCallback(
    (subset: string) => {
      router.get(
        route('data-explorer', {
          subsetGroup: 'Interruption Analysis',
          subset: subset,

          month: dateToYearMonth(selectedMonth),
          route: route('operation.index'),
        })
      )
    },
    [selectedMonth]
  )

  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0
  return (
    <div className='flex w-full flex-col'>
      <div>
        <ResponsiveContainer
          width='100%'
          height={50}
        >
          <BarChart
            data={interruptionDurationData}
            layout='vertical'
          >
            <XAxis
              type='number'
              hide
            />
            <YAxis
              type='category'
              dataKey='name'
              hide
            />
            <Tooltip content={renderCustomTooltip} />
            <Bar
              dataKey='interruptionDurationUrban'
              stackId='a'
              fill={solidColors[0]}
              onClick={() => handleGraphSelection('Interruption Duration - Analysis')}
            />
            <Bar
              dataKey='interruptionDurationRural'
              stackId='a'
              fill={solidColors[2]}
              onClick={() => handleGraphSelection('Interruption Duration - Analysis')}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className='flex justify-between px-5'>
        <button
          className='flex flex-col items-start px-10'
          onClick={() => handleGraphSelection('Interruption Duration - Analysis')}
        >
          <div
            style={{ color: solidColors[0] }}
            className='smmetric-1stop'
          >
            {formatNumber(interruptionDurationUrban)} HRS
          </div>
          <div className='small-1stop text-center'>
            Interruption <br /> duration - urban
          </div>
        </button>

        <button
          className='flex flex-col items-end px-32'
          onClick={() => handleGraphSelection('Interruption Duration - Analysis')}
        >
          <div
            style={{ color: solidColors[2] }}
            className='smmetric-1stop'
          >
            {formatNumber(interruptionDurationRural)} HRS
          </div>
          <div className='small-1stop text-center'>
            Interruption <br /> duration - rural
          </div>
        </button>
      </div>

      <div>
        <ResponsiveContainer
          width='100%'
          height={50}
        >
          <BarChart
            data={interruptionData}
            layout='vertical'
          >
            <XAxis
              type='number'
              hide
            />
            <YAxis
              type='category'
              dataKey='name'
              hide
            />
            <Tooltip content={renderCustomTooltip} />
            <Bar
              dataKey='interruptionUrban'
              stackId='a'
              fill={solidColors[1]}
              onClick={() => handleGraphSelection('Interruptions - Analysis')}
            />
            <Bar
              dataKey='interruptionRural'
              stackId='a'
              fill={solidColors[3]}
              onClick={() => handleGraphSelection('Interruptions - Analysis')}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className='flex justify-between px-5'>
        <button
          className='flex flex-col items-start px-10'
          onClick={() => handleGraphSelection('Interruptions - Analysis')}
        >
          <div
            style={{ color: solidColors[1] }}
            className='smmetric-1stop'
          >
            {formatNumber(interruptionUrban)}
          </div>
          <div className='small-1stop text-center'>
            Interruption -<br /> urban
          </div>
        </button>

        <button
          className='flex flex-col items-end px-32'
          onClick={() => handleGraphSelection('Interruptions - Analysis')}
        >
          <div
            style={{ color: solidColors[3] }}
            className='smmetric-1stop'
          >
            {formatNumber(interruptionRural)}
          </div>
          <div className='small-1stop text-center'>
            Interruption -
            <br /> rural
          </div>
        </button>
      </div>
    </div>
  )
}
export default ReliabilityTrend
