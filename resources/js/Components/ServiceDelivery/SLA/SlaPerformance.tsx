import TooglePercentage from '@/Components/ui/TogglePercentage'
import ToogleNumber from '@/Components/ui/ToogleNumber'
import useFetchRecord from '@/hooks/useFetchRecord'
import Card from '@/ui/Card/Card'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link } from 'lucide-react'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import SlaTrend from './SlaTrend'
import MoreButton from '@/Components/MoreButton'

export interface SlaPerformanceValues {
  requests_beyond_sla____: number
  requests_within_sla____: number
  month_year: string
  request_type: string
  requests_beyond_sla_count_: number
  requests_within_sla__count_: number
}

const SlaPerformance = () => {
  const [toggleValue, settoggleValue] = useState<boolean>(false)

  const [selectedLevel, setSelectedLevel] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [graphValues] = useFetchRecord<{
    data: SlaPerformanceValues[]
    month: number
    year: number
    latest_value: string
  }>(
    `subset/82?${selectedMonth == null ? 'latest=month_year' : `month_year=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}`
  )
  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
  const groupedDataPercentage = Array.from(
    new Map(
      graphValues?.data.map(
        ({ request_type, requests_within_sla____, requests_beyond_sla____ }) => [
          request_type,
          { name: request_type, requests_within_sla____, requests_beyond_sla____ },
        ]
      )
    ).values()
  )

  const groupedDataNumber = Array.from(
    new Map(
      graphValues?.data.map(
        ({ request_type, requests_within_sla__count_, requests_beyond_sla_count_ }) => [
          request_type,
          { name: request_type, requests_within_sla__count_, requests_beyond_sla_count_ },
        ]
      )
    ).values()
  )

  const groupedData = toggleValue ? groupedDataNumber : groupedDataPercentage

  const CustomTick = (props) => {
    const { x, y, payload } = props
    const displayName =
      payload.value.length > 10 ? `${payload.value.slice(0, 9)}...` : payload.value

    return (
      <text
        x={x}
        y={y}
        dy={16}
        textAnchor='end'
        transform={`rotate(-45, ${x}, ${y})`}
        className='axial-label-1stop'
      >
        {displayName}
      </text>
    )
  }

  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0

  const handleToogleNumber = () => {
    settoggleValue(!toggleValue)
  }

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex w-1/12 flex-col rounded-2xl'>
          <button
            className={`rounded-tl-2xl border p-5 ${selectedLevel === 1 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(1)
            }}
          >
            <svg
              width='28'
              height='28'
              viewBox='0 0 28 28'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M14.0008 5.25L23.5993 21.875H4.40234L14.0008 5.25Z'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M14.0008 5.25L23.5993 21.875H4.40234L14.0008 5.25Z'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M2.33398 12.8332L11.3757 9.9165'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M16.334 9.3335L25.6673 7.5835'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M17.5 11.375L25.6667 12.25'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M19.0742 14L25.6659 16.9167'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
          <button
            className={`border p-5 ${selectedLevel === 2 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.region_code ?? '')
              setSelectedLevel(2)
            }}
          >
            <svg
              width='28'
              height='28'
              viewBox='0 0 28 28'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M22.75 3.5H5.25C4.2835 3.5 3.5 4.2835 3.5 5.25V22.75C3.5 23.7165 4.2835 24.5 5.25 24.5H22.75C23.7165 24.5 24.5 23.7165 24.5 22.75V5.25C24.5 4.2835 23.7165 3.5 22.75 3.5Z'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinejoin='round'
              />
              <path
                d='M7.83984 17.4035L11.1397 14.1037L13.6994 16.6573L19.8333 10.5'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M15.166 10.5H19.8327V15.1667'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
          <button
            className={`border p-5 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
              setSelectedLevel(3)
            }}
          >
            <svg
              width='28'
              height='28'
              viewBox='0 0 28 28'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M13.416 5.25H25.0827'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M2.91602 9.33317L7.58268 4.6665'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M7.58398 4.6665V24.4998'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M13.416 11.0835H22.7493'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M13.416 16.9165H20.416'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M13.416 22.75H18.0827'
                stroke='#333333'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
          <button
            className={`border p-5 ${selectedLevel === 4 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.division_code ?? '')
            }}
          >
            <p></p>
          </button>
          <button
            className={`border p-5 ${selectedLevel === 5 ? 'bg-1stop-highlight2' : 'bg-button-muted'}`}
            onClick={() => {
              // setLevelName('section_code')
              // setLevelCode(level?.record.section_code ?? '')
            }}
          >
            <p></p>
          </button>
        </div>
        {selectedLevel === 1 && (
          <div className='flex w-11/12 flex-row gap-4 p-2'>
            <div className='w-full rounded-lg bg-white p-4'>
              <div>
                {isLoading ? (
                  <Skeleton
                    height={300}
                    width='100%'
                  />
                ) : (
                  <div>
                    <button
                      className='small-1stop mb-auto cursor-pointer justify-end'
                      onClick={handleToogleNumber}
                    >
                      {toggleValue ? <ToogleNumber /> : <TooglePercentage />}
                    </button>
                    <ResponsiveContainer
                      width='100%'
                      height={300}
                    >
                      <BarChart
                        data={groupedData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barSize={40}
                      >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis
                          dataKey='name'
                          tick={<CustomTick />}
                          height={80}
                          interval={0}
                        />
                        <YAxis hide />
                        <Tooltip formatter={(value: number) => value.toFixed(2)} />
                        <Bar
                          dataKey={
                            toggleValue ? 'requests_within_sla__count_' : 'requests_within_sla____'
                          }
                          stackId='a'
                          fill='#1b50b3'
                        />
                        <Bar
                          dataKey={
                            toggleValue ? 'requests_beyond_sla_count_' : 'requests_beyond_sla____'
                          }
                          stackId='a'
                          fill='#76a5ff'
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {selectedLevel === 2 && (
          <SlaTrend
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}
      </div>

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-white px-4'>
        <p className='h3-1stop'>SLA Performance by Request Type</p>
        <div className='small-1stop-header flex h-full w-1/3 items-center bg-1stop-accent2 px-4'>
          {/* {graphValues.length > 0 &&
            new Date(graphValues[0].data_date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })} */}
          <MonthPicker
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
        <div className='hover:cursor-pointer hover:opacity-50'>
          <Link href='/dataset/61'>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default SlaPerformance
