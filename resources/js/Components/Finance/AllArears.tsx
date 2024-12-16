import Card from '@/ui/Card/Card'
import Top10Icon from '../ui/Top10Icon'
import DataShowIcon from '../ui/DatashowIcon'
import TrendIcon from '../ui/TrendIcon'
import { Link, router } from '@inertiajs/react'
import MoreButton from '../MoreButton'
import MonthPicker from '@/ui/form/MonthPicker'
import { useCallback, useEffect, useState } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import { dateToYearMonth, formatNumber } from '../ServiceDelivery/ActiveConnection'
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
  const handleGraphSelection = useCallback(
    (subset: string, selectedVoltageType: string | null) => {
      router.get(
        route('data-explorer', {
          subsetGroup: 'Arrears Comparison',
          subset: subset,
          voltage: selectedVoltageType,
          month: dateToYearMonth(selectedMonth),
          route: route('finance.index'),
        })
      )
    },
    [selectedMonth]
  )
  const detailRoute = () => {
    router.get(
      `/data-explorer/Arrears Comparison?latest=${selectedMonth}&route=${route('finance.index')}`
    )
  }
  return (
    <div className='flex w-full flex-col md:flex-row'>
      {selectedLevel === 1 && (
        <div className='flex justify-center'>
          <div className='grid w-full grid-rows-2 gap-2 p-2 md:max-w-md'>
            <button
              onClick={() => handleGraphSelection('Arrears By Category - All', null)}
              className='flex w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-accent2 p-1 hover:bg-1stop-highlight2 lg:p-5'
            >
              <p className='smmetric-1stop lg:xlmetric-1stop'>
                {isLoading ? <Skeleton width={60} /> : formatNumber(totalArrears)}
              </p>
              <p className='small-1stop-header text-center'>Total Arrears</p>
            </button>
            <div className='grid grid-cols-2 gap-2'>
              <button
                onClick={() => handleGraphSelection('Arrears By Category - All', 'LT')}
                className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-1 hover:bg-1stop-highlight2 lg:p-5'
              >
                <p className='smmetric-1stop lg:mdmetric-1stop'>
                  {isLoading ? <Skeleton width={60} /> : formatNumber(lTArrears)}
                </p>
                <p className='small-1stop-header text-center'>LT Arrears</p>
              </button>
              <button
                onClick={() => handleGraphSelection('Arrears By Category - All', 'HT')}
                className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-1stop-white p-1 hover:bg-1stop-highlight2 lg:p-5'
              >
                <p className='smmetric-1stop lg:mdmetric-1stop pt-4'>
                  {isLoading ? <Skeleton width={60} /> : formatNumber(hTArrears)}
                </p>
                <p className='small-1stop-header text-center'>HT Arrears</p>
              </button>
            </div>
          </div>
        </div>

        // <div className='px-4 pt-10'>
        //   <Card className='w-full bg-1stop-accent2 p-5'>
        //     <div className='text-center'>
        //       <div className='smmetric-1stop lg:xlmetric-1stop'>
        //         {isLoading ? <Skeleton width={60} /> : formatNumber(totalArrears)}
        //       </div>
        //       <div className='small-1stop-header text-center'>Total Arrears</div>
        //     </div>
        //   </Card>
        //   <div className='flex justify-around gap-5 p-3 pt-7'>
        //     <Card className='w-1/2 bg-1stop-gray p-5 text-center'>
        //       <div>
        //         <div className='smmetric-1stop lg:xlmetric-1stop text-nowrap'>
        //           {isLoading ? <Skeleton width={60} /> : formatNumber(lTArrears)}
        //         </div>
        //         <div className='small-1stop-header text-center'>LT Arrears</div>
        //       </div>
        //     </Card>
        //     <Card className='w-1/2 bg-1stop-white p-5 text-center'>
        //       <div>
        //         <div className='smmetric-1stop lg:xlmetric-1stop text-nowrap'>
        //           {isLoading ? <Skeleton width={60} /> : formatNumber(hTArrears)}
        //         </div>
        //         <div className='small-1stop-header text-center'>HT Arrears</div>
        //       </div>
        //     </Card>
        //   </div>
        // </div>
      )}
    </div>
  )
}

export default AllArears
