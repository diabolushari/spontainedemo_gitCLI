import Card from '@/ui/Card/Card'
import Top10Icon from '../ui/Top10Icon'
import DataShowIcon from '../ui/DatashowIcon'
import TrendIcon from '../ui/TrendIcon'
import { Link } from '@inertiajs/react'
import MoreButton from '../MoreButton'
import MonthPicker from '@/ui/form/MonthPicker'
import { useEffect, useState } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import { formatNumber } from '../ServiceDelivery/ActiveConnection'
import AllArrearsTrend from './AllArrearsTrend'
import Skeleton from 'react-loading-skeleton'
import AllArrearsList from './AllArrearsList'

export interface AllArearsValue {
  month: string
  total_arrears: number
  voltage: string
}
interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}
const AllArears = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [selectedLevel, setSelectedLevel] = useState(1)

  const [graphValues] = useFetchRecord<{
    data: AllArearsValue[]
    latest_value: string
  }>(
    `subset/169?${selectedMonth == null ? 'latest=month' : `month=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}`
  )
  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
  const totalArrears = graphValues?.data.reduce((sum, value) => sum + value.total_arrears, 0) || 0
  const lTArrears =
    graphValues?.data
      .filter((value) => value.voltage === 'LT')
      .reduce((sum, value) => sum + value.total_arrears, 0) || 0
  const hTArrears =
    graphValues?.data
      .filter((value) => value.voltage === 'HT')
      .reduce((sum, value) => sum + value.total_arrears, 0) || 0

  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0
  return (
    <div className='flex w-full flex-col'>
      {selectedLevel === 1 && (
        <div className='p-5 pt-10 md:ml-10 md:pl-10'>
          <Card className='w-full bg-1stop-accent2 p-5'>
            <div className='text-center'>
              <div className='h2-1stop pr-3'>
                {isLoading ? <Skeleton width={60} /> : formatNumber(totalArrears)}
              </div>
              <div className='body-1stop'>Total Arrears</div>
            </div>
          </Card>
          <div className='flex justify-around gap-5 p-3 pt-7'>
            <Card className='w-1/2 bg-1stop-gray p-5 text-center'>
              <div>
                <div className='h3-1stop text-nowrap'>
                  {isLoading ? <Skeleton width={60} /> : formatNumber(lTArrears)}
                </div>
                <div className='small-1stop'>LT Arrears</div>
              </div>
            </Card>
            <Card className='w-1/2 bg-1stop-white p-5 text-center'>
              <div>
                <div className='h3-1stop text-nowrap'>
                  {isLoading ? <Skeleton width={60} /> : formatNumber(hTArrears)}
                </div>
                <div className='small-1stop'>HT Arrears</div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllArears
