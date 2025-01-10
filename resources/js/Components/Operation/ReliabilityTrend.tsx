import useFetchRecord from '@/hooks/useFetchRecord'
import { dateToYearMonth, formatNumber } from '../ServiceDelivery/ActiveConnection'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { solidColors } from '@/ui/ui_interfaces'
import Skeleton from 'react-loading-skeleton'

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
              onClick={() => ''}
            />
            <Bar
              dataKey='interruptionDurationRural'
              stackId='a'
              fill={solidColors[2]}
              onClick={() => ''}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className='flex'>
        <div className='flex-col justify-start p-5'>
          <div
            style={{ color: solidColors[0] }}
            className='smmetric-1stop'
          >
            {formatNumber(interruptionDurationUrban)} HRS
          </div>
          <div className='small-1stop'>
            Interruption <br /> duration - urban
          </div>
        </div>
        <div className='flex-col justify-end p-5'>
          <div
            style={{ color: solidColors[2] }}
            className='smmetric-1stop'
          >
            {formatNumber(interruptionDurationRural)} HRS
          </div>
          <div className='small-1stop'>
            Interruption <br /> duration - rural
          </div>
        </div>
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
            <Bar
              dataKey='interruptionUrban'
              stackId='a'
              fill={solidColors[1]}
              onClick={() => ''}
            />
            <Bar
              dataKey='interruptionRural'
              stackId='a'
              fill={solidColors[3]}
              onClick={() => ''}
            />
            <Tooltip content={renderCustomTooltip} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className='flex'>
        <div className='flex-col justify-start p-5'>
          <div
            style={{ color: solidColors[1] }}
            className='smmetric-1stop'
          >
            {formatNumber(interruptionUrban)}
          </div>
          <div className='small-1stop'>
            Interruption -<br /> urban
          </div>
        </div>
        <div className='flex-col justify-end p-5'>
          <div
            style={{ color: solidColors[3] }}
            className='smmetric-1stop'
          >
            {formatNumber(interruptionRural)}
          </div>
          <div className='small-1stop'>
            Interruption -<br /> rural
          </div>
        </div>
      </div>
    </div>
  )
}
export default ReliabilityTrend
