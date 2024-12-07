import React, { useEffect, useState } from 'react'
import Card from '@/ui/Card/Card'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from '@inertiajs/react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import MonthPicker from '@/ui/form/MonthPicker'
import { CustomLegend, formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import useFetchRecord from '@/hooks/useFetchRecord'
import DataShowIcon from '@/Components/ui/DatashowIcon'
import Top10Icon from '@/Components/ui/Top10Icon'
import { CustomTooltip } from '@/Components/CustomTooltip'
import { solidColors } from '@/ui/ui_interfaces'
import MoreButton from '@/Components/MoreButton'
import ToogleNumber from '@/Components/ui/ToogleNumber'
import TooglePercentage from '@/Components/ui/TogglePercentage'
import ArriersLTList from './ArriersLTList'

interface ArriersHT {
  month: string
  consumer_category: string
  voltage: string
  total_arrears: number
  arrears__0_3_months_: number
  arrears__4_6_months_: number
  arrears__7_12_months_: number
  arrears__13_24_months_: number
  arrears___24_months_: number
  arrears_percentage__0_3_months_: number
  arrears_percentage__4_6_months_: number
  arrears_percentage__7_12_months_: number
  arrears_percentage__13_24_months_: number
  arrears_percentage___24_months_: number
}

const ArriersLT = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  const [selectedLevel, setSelectedLevel] = useState(1)
  const [range, setRange] = useState('Total')
  const [toggleValue, settoggleValue] = useState<boolean>(false)
  const handleToogleNumber = () => {
    settoggleValue(!toggleValue)
  }

  const [graphValues] = useFetchRecord<{ data: ArriersHT[]; latest_value: string }>(
    `subset/186?${
      selectedMonth == null
        ? 'latest=month'
        : `month=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`
    }`
  )

  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])

  graphValues?.data.sort((a, b) => a.total_arrears - b.total_arrears).reverse()
  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0

  const filters = (index: number) => {
    if (index < 3) {
      switch (range) {
        case 'Total':
          return graphValues?.data[index].total_arrears
        case '0-3':
          return toggleValue
            ? graphValues?.data[index].arrears__0_3_months_
            : graphValues?.data[index].arrears_percentage__0_3_months_
        case '4-6':
          return toggleValue
            ? graphValues?.data[index].arrears__4_6_months_
            : graphValues?.data[index].arrears_percentage__4_6_months_
        case '7-12':
          return toggleValue
            ? graphValues?.data[index].arrears__7_12_months_
            : graphValues?.data[index].arrears_percentage__7_12_months_
        case '>12':
          return toggleValue
            ? graphValues?.data[index]?.arrears__13_24_months_ != null &&
              graphValues?.data[index]?.arrears___24_months_ != null
              ? graphValues?.data[index]?.arrears__13_24_months_ +
                graphValues?.data[index]?.arrears___24_months_
              : 0
            : graphValues?.data[index].arrears_percentage__13_24_months_ != null &&
                graphValues?.data[index].arrears_percentage___24_months_ != null
              ? graphValues?.data[index].arrears_percentage__13_24_months_ +
                graphValues?.data[index]?.arrears___24_months_
              : 0
      }
    } else {
      switch (range) {
        case 'Total':
          return graphValues?.data
            .filter(
              (value) =>
                value.consumer_category !== graphValues?.data[0]?.consumer_category &&
                value.consumer_category !== graphValues?.data[1]?.consumer_category &&
                value.consumer_category !== graphValues?.data[2]?.consumer_category
            )
            .reduce((sum, value) => sum + value.total_arrears, 0)
        case '0-3':
          return graphValues?.data
            .filter(
              (value) =>
                value.consumer_category !== graphValues?.data[0]?.consumer_category &&
                value.consumer_category !== graphValues?.data[1]?.consumer_category &&
                value.consumer_category !== graphValues?.data[2]?.consumer_category
            )
            .reduce(
              (sum, value) =>
                sum +
                (toggleValue ? value.arrears__0_3_months_ : value.arrears_percentage__0_3_months_),
              0
            )
        case '4-6':
          return graphValues?.data
            .filter(
              (value) =>
                value.consumer_category !== graphValues?.data[0]?.consumer_category &&
                value.consumer_category !== graphValues?.data[1]?.consumer_category &&
                value.consumer_category !== graphValues?.data[2]?.consumer_category
            )
            .reduce(
              (sum, value) =>
                sum +
                (toggleValue ? value.arrears__4_6_months_ : value.arrears_percentage__4_6_months_),
              0
            )
        case '7-12':
          return graphValues?.data
            .filter(
              (value) =>
                value.consumer_category !== graphValues?.data[0]?.consumer_category &&
                value.consumer_category !== graphValues?.data[1]?.consumer_category &&
                value.consumer_category !== graphValues?.data[2]?.consumer_category
            )
            .reduce(
              (sum, value) =>
                sum +
                (toggleValue
                  ? value.arrears__7_12_months_
                  : value.arrears_percentage__7_12_months_),
              0
            )
        case '>12':
          return graphValues?.data
            .filter(
              (value) =>
                value.consumer_category !== graphValues?.data[0]?.consumer_category &&
                value.consumer_category !== graphValues?.data[1]?.consumer_category &&
                value.consumer_category !== graphValues?.data[2]?.consumer_category
            )
            .reduce(
              (sum, value) =>
                sum +
                (toggleValue
                  ? value.arrears__13_24_months_ + value.arrears___24_months_
                  : value.arrears_percentage__13_24_months_ +
                    value.arrears_percentage___24_months_),
              0
            )
      }
    }
  }

  const arrearCount = (range: string) => {
    switch (range) {
      case 'Total':
        return graphValues?.data.reduce((sum, value) => sum + value.total_arrears, 0)
      case '0-3':
        return graphValues?.data.reduce(
          (sum, value) =>
            sum +
            (toggleValue ? value.arrears__0_3_months_ : value.arrears_percentage__0_3_months_),
          0
        )
      case '4-6':
        return graphValues?.data.reduce(
          (sum, value) =>
            sum +
            (toggleValue ? value.arrears__4_6_months_ : value.arrears_percentage__4_6_months_),
          0
        )
      case '7-12':
        return graphValues?.data.reduce(
          (sum, value) =>
            sum +
            (toggleValue ? value.arrears__7_12_months_ : value.arrears_percentage__7_12_months_),
          0
        )
      case '>12':
        return graphValues?.data.reduce(
          (sum, value) =>
            sum +
            (toggleValue
              ? value.arrears__13_24_months_ + value.arrears___24_months_
              : value.arrears_percentage__13_24_months_ + value.arrears_percentage___24_months_),
          0
        )
    }
  }

  const data = [
    {
      name: graphValues?.data[0]?.consumer_category,
      value: filters(0),
    },
    {
      name: graphValues?.data[1]?.consumer_category,
      value: filters(1),
    },
    {
      name: graphValues?.data[2]?.consumer_category,
      value: filters(2),
    },
    {
      name: 'Other',
      value: filters(3),
    },
  ]

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
            <Top10Icon />
          </button>
          <button
            className={`flex w-full border border-white px-2 py-4 ${selectedLevel === 3 ? 'bg-1stop-highlight2' : 'bg-1stop-alt-gray'}`}
            onClick={() => {
              // setLevelName('office_code')
              // setLevelCode(level?.record.circle_code ?? '')
            }}
          ></button>
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
        {/* Data Section */}
        {selectedLevel === 1 && (
          <div className='flex w-full flex-row space-x-1 p-2'>
            <div className='flex w-1/2 flex-col gap-1 pt-4'>
              {/* Total Connections */}
              <button
                className='small-1stop mb-auto ml-auto cursor-pointer justify-end'
                onClick={handleToogleNumber}
              >
                {toggleValue ? <ToogleNumber /> : <TooglePercentage />}
              </button>
              <div className='flex flex-col border p-2'>
                <p className='xlmetric-1stop'>
                  {graphValues?.data.length ? (
                    formatNumber(arrearCount('Total') ?? 0)
                  ) : (
                    <Skeleton />
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>Total Arrears</p>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radio'
                      checked={range === 'Total'}
                      onClick={() => setRange('Total')}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 bg-1stop-alt-highlight checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>

              <div className='flex w-full flex-row space-x-1'>
                {/* LT */}
                <div className='flex w-1/2 flex-col border p-2'>
                  <p className='mdmetric-1stop'>
                    {graphValues?.data.length ? (
                      toggleValue ? (
                        formatNumber(arrearCount('0-3') ?? 0)
                      ) : (
                        `${arrearCount('0-3')?.toFixed(2)}%`
                      )
                    ) : (
                      <Skeleton />
                    )}
                  </p>
                  <div className='flex flex-row justify-between'>
                    <p className='small-1stop-header'>0-3mo </p>
                    <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                      <input
                        type='radio'
                        name='radio'
                        onClick={() => setRange('0-3')}
                        className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                      />
                    </div>
                  </div>
                </div>

                {/* HT */}
                <div className='flex w-1/2 flex-col border p-2'>
                  <p className='mdmetric-1stop'>
                    {graphValues?.data.length ? (
                      toggleValue ? (
                        formatNumber(arrearCount('4-6') ?? 0)
                      ) : (
                        `${arrearCount('4-6')?.toFixed(2)}%`
                      )
                    ) : (
                      <Skeleton />
                    )}
                  </p>
                  <div className='flex flex-row justify-between'>
                    <p className='small-1stop-header'>4mo-6mo </p>
                    <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                      <input
                        type='radio'
                        name='radio'
                        onClick={() => setRange('4-6')}
                        className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* EHT */}

              <div className='flex w-full flex-row space-x-1'>
                <div className='flex w-1/2 flex-col border p-2'>
                  <p className='mdmetric-1stop'>
                    {graphValues?.data.length ? (
                      toggleValue ? (
                        formatNumber(arrearCount('7-12') ?? 0)
                      ) : (
                        `${arrearCount('7-12')?.toFixed(2)}%`
                      )
                    ) : (
                      <Skeleton />
                    )}
                  </p>
                  <div className='flex flex-row justify-between'>
                    <p className='small-1stop-header'>7mo-12mo </p>
                    <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                      <input
                        type='radio'
                        name='radio'
                        onClick={() => setRange('7-12')}
                        className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                      />
                    </div>
                  </div>
                </div>

                <div className='flex w-1/2 flex-col border p-2'>
                  <p className='mdmetric-1stop'>
                    {graphValues?.data.length ? (
                      toggleValue ? (
                        formatNumber(arrearCount('>12') ?? 0)
                      ) : (
                        `${arrearCount('>12')?.toFixed(2)}%`
                      )
                    ) : (
                      <Skeleton />
                    )}
                  </p>
                  <div className='flex flex-row justify-between'>
                    <p className='small-1stop-header'> {'>'}12 mo </p>
                    <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                      <input
                        type='radio'
                        name='radio'
                        onClick={() => setRange('>12')}
                        className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graph */}
            <div className='relative flex w-1/2 justify-center'>
              {isLoading ? (
                <Skeleton
                  circle={true}
                  height={200}
                  width={200}
                />
              ) : (
                <ResponsiveContainer className='small-1stop'>
                  <PieChart
                    width={100}
                    height={100}
                  >
                    <Tooltip
                      formatter={(value: number) => `${formatNumber(value)}`}
                      content={<CustomTooltip />}
                    />

                    <Pie
                      data={data}
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey='value'
                      stroke='none'
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={solidColors[index % solidColors.length]}
                        />
                      ))}
                    </Pie>

                    <Legend content={CustomLegend} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* <span className='subheader-sm-1stop absolute bottom-11'>CONNECTIONS BY CATEGORY</span> */}
            </div>
          </div>
        )}

        {selectedLevel === 2 && (
          <ArriersLTList
            column1='State'
            column2='Consumer count'
            subset_id='186'
            default_level='section'
            route={`/office-rankings/Active Connections Summary?route=${route('service-delivery.index')}`}
          />
        )}
      </div>
      {/* //Footer */}
      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-alt-gray px-4 pl-12'>
        <div className='py-4'>
          <p className='mdmetric-1stop'>Arrears Age-wise, LT</p>
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
          <Link
            href={`/data-explorer/Arrear Summary - LT?latest=month?route=${route('finance.index')}`}
          >
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}
export default ArriersLT
