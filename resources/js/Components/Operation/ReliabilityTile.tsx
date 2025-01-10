import useFetchRecord from '@/hooks/useFetchRecord'
import { dateToYearMonth, formatNumber } from '../ServiceDelivery/ActiveConnection'
import { useCallback } from 'react'
import { router } from '@inertiajs/react'
import Skeleton from 'react-loading-skeleton'

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}
interface ReliabilityTileValues {
  month: string
  saifi: number
  saidi: number
  total_interruptions: number
  total_interruption_duration__h_: number
}
const ReliabilityTile = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [graphValues] = useFetchRecord<{
    data: ReliabilityTileValues[]
    latest_value: string
  }>(
    `subset/344?${selectedMonth == null ? 'latest=month' : `month=${dateToYearMonth(selectedMonth)}`}`
  )

  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0

  const saiFi = graphValues?.data.reduce((sum, record) => sum + record.saifi, 0)
  const saiDi = graphValues?.data.reduce((sum, record) => sum + record.saidi, 0)
  const totalInterruption = graphValues?.data.reduce(
    (sum, record) => sum + record.total_interruptions,
    0
  )
  const totalInterruptionDuration = graphValues?.data.reduce(
    (sum, record) => sum + record.total_interruption_duration__h_,
    0
  )
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

  return (
    <div className='flex w-full flex-col md:flex-row'>
      <div className='flex justify-center'>
        <div className='grid w-full grid-cols-2 gap-2 p-2 md:max-w-md'>
          <button
            className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-1 hover:bg-1stop-highlight2 lg:p-5'
            onClick={() => handleGraphSelection('SAIDI - Analysis')}
          >
            <p className='smmetric-1stop lg:xlmetric-1stop'>
              {isLoading ? <Skeleton width={60} /> : formatNumber(saiDi)}
            </p>
            <p className='small-1stop-header text-center'>SAIDI</p>
          </button>
          <button
            onClick={() => handleGraphSelection('SAIDI - Analysis')}
            className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-1 hover:bg-1stop-highlight2 lg:p-5'
          >
            <p className='smmetric-1stop'>
              {isLoading ? (
                <Skeleton width={60} />
              ) : (
                formatNumber(totalInterruptionDuration) + ' Hrs'
              )}
            </p>
            <p className='small-1stop-header text-center'>TOTAL INTERRUPTION DURATION</p>
          </button>
          <button
            onClick={() => handleGraphSelection('SAIFI - Analysis')}
            className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-1 hover:bg-1stop-highlight2 lg:p-5'
          >
            <p className='smmetric-1stop lg:xlmetric-1stop'>
              {isLoading ? <Skeleton width={60} /> : formatNumber(saiFi)}
            </p>
            <p className='small-1stop-header text-center'>SAIFI</p>
          </button>
          <button
            onClick={() => handleGraphSelection('SAIFI - Analysis')}
            className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-1 hover:bg-1stop-highlight2 lg:p-5'
          >
            <p className='smmetric-1stop pt-4'>
              {isLoading ? <Skeleton width={60} /> : formatNumber(totalInterruption)}
            </p>
            <p className='small-1stop-header text-center'>TOTAL INTERRUPTION</p>
          </button>
        </div>
      </div>
    </div>
  )
}
export default ReliabilityTile
