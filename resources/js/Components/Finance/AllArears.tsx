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

const AllArears = () => {
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

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
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-14 flex-col rounded-2xl'>
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
            className={`flex w-full border border-white px-2 py-4 ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(2)
            }}
          >
            <TrendIcon />
          </button>
          <button
            className={`flex w-full border border-white px-2 py-4 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
              setSelectedLevel(3)
            }}
          >
            <Top10Icon />
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
        </div>
        {selectedLevel === 1 && (
          <div className='ml-10 p-5 pl-10 pt-10'>
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
        {selectedLevel === 2 && (
          <AllArrearsTrend
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}
        {selectedLevel === 3 && (
          <AllArrearsList
            column1='Section'
            column2='Arrears'
            subset_id='170'
            default_level='section'
            sortBy='total_arrears'
          />
        )}
      </div>
      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-alt-gray px-4 pl-12'>
        <div className='py-4'>
          <p className='mdmetric-1stop'>All Arrears</p>
        </div>
        <div
          className='small-1stop-header flex h-full w-1/3 items-center bg-1stop-accent2 bg-opacity-50 px-4'
          //   style={{ backgroundBlendMode: 'overlay', opacity: 0.7 }}
        >
          <div style={{ opacity: 1 }}>
            <MonthPicker
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </div>
        <div className='hover:cursor-pointer hover:opacity-50'>
          <Link href={`/data-explorer/Total Arrears?latest=month&route=${route('finance.index')}`}>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default AllArears
