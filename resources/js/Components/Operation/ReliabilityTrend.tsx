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
  avg_customer_interruption_duration___urban: number
  avg_customer_interruption_duration___rural: number
  total_interruptions: number
  avg_customer_interruptions___urban: number
  avg_customer_interruptions___rural: number
  avg_customer_avg_customer_interruptions___rural: number
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
    `subset/360?${selectedMonth == null ? 'latest=month' : `month=${dateToYearMonth(selectedMonth)}`}`
  )
  const avgInterruptionDurationRural = graphValues?.data.reduce(
    (sum, record) => sum + record.avg_customer_interruption_duration___rural,
    0
  )
  const avgInterruptionRural = graphValues?.data.reduce(
    (sum, record) => sum + record.avg_customer_interruptions___rural,
    0
  )
  const avgInterruptionDurationUrban = graphValues?.data.reduce(
    (sum, record) => sum + record.avg_customer_interruption_duration___urban,
    0
  )
  const avgInterruptionUrban = graphValues?.data.reduce(
    (sum, record) => sum + record.avg_customer_interruptions___urban,
    0
  )
  const avgInterruptionDurationData = [
    { name: 'Interruption Duration ', avgInterruptionDurationUrban, avgInterruptionDurationRural },
  ]

  const avgInterruptionData = [
    { name: 'Interruption ', avgInterruptionUrban, avgInterruptionRural },
  ]

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
    <div className='flex w-full flex-col lg:justify-between'>
      <div>
        {isLoading ? (
          <Skeleton height={50} />
        ) : (
          <ResponsiveContainer
            width='100%'
            height={50}
          >
            <BarChart
              data={avgInterruptionDurationData}
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
                dataKey='avgInterruptionDurationUrban'
                stackId='a'
                fill={solidColors[0]}
                onClick={() => handleGraphSelection('Interruption Duration - Analysis')}
              />
              <Bar
                dataKey='avgInterruptionDurationRural'
                stackId='a'
                fill={solidColors[2]}
                onClick={() => handleGraphSelection('Interruption Duration - Analysis')}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className='flex justify-between px-0 lg:px-5'>
        <button
          className='flex flex-col items-start px-2 md:px-10'
          onClick={() => handleGraphSelection('Interruption Duration - Analysis')}
        >
          <div
            style={{ color: solidColors[0] }}
            className='smmetric-1stop text-center'
          >
            {formatNumber(avgInterruptionDurationUrban)} Hrs
          </div>
          <div className='small-1stop text-center'>Avg Intrpn Dur - URBAN</div>
        </button>

        <button
          className='flex flex-col items-end px-2 md:px-32'
          onClick={() => handleGraphSelection('Interruption Duration - Analysis')}
        >
          <div
            style={{ color: solidColors[2] }}
            className='smmetric-1stop'
          >
            {formatNumber(avgInterruptionDurationRural)} Hrs
          </div>
          <div className='small-1stop text-center'>Avg Intrpn Dur - RURAL</div>
        </button>
      </div>

      <div>
        {isLoading ? (
          <Skeleton height={50} />
        ) : (
          <ResponsiveContainer
            width='100%'
            height={50}
          >
            <BarChart
              data={avgInterruptionData}
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
                dataKey='avgInterruptionUrban'
                stackId='a'
                fill={solidColors[1]}
                onClick={() => handleGraphSelection('Interruptions - Analysis')}
              />
              <Bar
                dataKey='avgInterruptionRural'
                stackId='a'
                fill={solidColors[3]}
                onClick={() => handleGraphSelection('Interruptions - Analysis')}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className='flex justify-between px-0 lg:px-5'>
        <button
          className='flex flex-col items-start px-2 md:px-10'
          onClick={() => handleGraphSelection('Interruptions - Analysis')}
        >
          <div
            style={{ color: solidColors[1] }}
            className='smmetric-1stop text-center'
          >
            {formatNumber(avgInterruptionUrban)}
          </div>
          <div className='small-1stop text-center'>Avg Intrpns - URBAN</div>
        </button>

        <button
          className='flex flex-col items-end px-2 md:px-32'
          onClick={() => handleGraphSelection('Interruptions - Analysis')}
        >
          <div
            style={{ color: solidColors[3] }}
            className='smmetric-1stop text-center'
          >
            {formatNumber(avgInterruptionRural)}
          </div>
          <div className='small-1stop text-center'>Avg Intrpns - RURAL</div>
        </button>
      </div>
    </div>
  )
}
export default ReliabilityTrend
