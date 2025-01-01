import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Card from '@/ui/Card/Card'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link, router } from '@inertiajs/react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import MonthPicker from '@/ui/form/MonthPicker'
import {
  CustomLegend,
  dateToYearMonth,
  formatNumber,
} from '@/Components/ServiceDelivery/ActiveConnection'
import useFetchRecord from '@/hooks/useFetchRecord'
import DataShowIcon from '@/Components/ui/DatashowIcon'
import Top10Icon from '@/Components/ui/Top10Icon'
import { CustomTooltip } from '@/Components/CustomTooltip'
import { solidColors } from '@/ui/ui_interfaces'
import MoreButton from '@/Components/MoreButton'
import ToogleNumber from '@/Components/ui/ToogleNumber'
import TooglePercentage from '@/Components/ui/TogglePercentage'
import ArriersHTList from './ArriersHTList'
import DashboardCardLayout from '@/Components/Dashboard/DashbaordCard/DashboardCardLayout'

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

const ArriersHT = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  const [selectedLevel, setSelectedLevel] = useState('overview')
  const [range, setRange] = useState('Total')
  const [toggleValue, settoggleValue] = useState<boolean>(false)
  const handleToogleNumber = () => {
    settoggleValue(!toggleValue)
  }

  const [graphValues] = useFetchRecord<{ data: ArriersHT[]; latest_value: string }>(
    `subset/180?${
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

  const graphData = useMemo(() => {
    if (graphValues?.data == null) {
      return []
    }
    switch (range) {
      case '0-3':
        return [...graphValues.data]
          .sort((a, b) => a.arrears__0_3_months_ - b.arrears__0_3_months_)
          .reverse()
      case '4-6':
        return [...graphValues.data]
          .sort((a, b) => a.arrears__4_6_months_ - b.arrears__4_6_months_)
          .reverse()

      case '7-12':
        return [...graphValues.data]
          .sort((a, b) => a.arrears__7_12_months_ - b.arrears__7_12_months_)
          .reverse()

      case '>12':
        return [...graphValues.data]
          .sort(
            (a, b) =>
              a.arrears__13_24_months_ +
              a.arrears___24_months_ -
              (b.arrears__13_24_months_ + b.arrears___24_months_)
          )
          .reverse()
      case 'Total':
        return [...graphValues.data].sort((a, b) => a.total_arrears - b.total_arrears).reverse()
      default:
        return []
    }
  }, [graphValues, range])
  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0

  const filters = (index: number) => {
    if (index < 3) {
      switch (range) {
        case 'Total':
          return graphData.length > 0 ? graphData[index].total_arrears : 0
        case '0-3':
          return graphData.length > 0 ? graphData[index].arrears__0_3_months_ : 0

        case '4-6':
          return graphData.length > 0 ? graphData[index].arrears__4_6_months_ : 0

        case '7-12':
          return graphData.length > 0 ? graphData[index].arrears__7_12_months_ : 0

        case '>12':
          return graphData.length > 0
            ? graphData[index]?.arrears__13_24_months_ != null &&
              graphData[index]?.arrears___24_months_ != null
              ? graphData[index]?.arrears__13_24_months_ + graphData[index]?.arrears___24_months_
              : 0
            : 0
      }
    } else {
      switch (range) {
        case 'Total':
          return graphData.length > 0
            ? graphData
                .filter(
                  (value) =>
                    value.consumer_category !== graphData[0]?.consumer_category &&
                    value.consumer_category !== graphData[1]?.consumer_category &&
                    value.consumer_category !== graphData[2]?.consumer_category
                )
                .reduce((sum, value) => sum + value.total_arrears, 0)
            : 0
        case '0-3':
          return graphData.length > 0
            ? graphValues?.data
                .filter(
                  (value) =>
                    value.consumer_category !== graphData[0]?.consumer_category &&
                    value.consumer_category !== graphData[1]?.consumer_category &&
                    value.consumer_category !== graphData[2]?.consumer_category
                )
                .reduce((sum, value) => sum + value.arrears__0_3_months_, 0)
            : 0
        case '4-6':
          return graphData.length > 0
            ? graphData
                .filter(
                  (value) =>
                    value.consumer_category !== graphData[0]?.consumer_category &&
                    value.consumer_category !== graphData[1]?.consumer_category &&
                    value.consumer_category !== graphData[2]?.consumer_category
                )
                .reduce((sum, value) => sum + value.arrears__4_6_months_, 0)
            : 0
        case '7-12':
          return graphData.length > 0
            ? graphData
                .filter(
                  (value) =>
                    value.consumer_category !== graphData[0]?.consumer_category &&
                    value.consumer_category !== graphData[1]?.consumer_category &&
                    value.consumer_category !== graphData[2]?.consumer_category
                )
                .reduce((sum, value) => sum + value.arrears__7_12_months_, 0)
            : 0
        case '>12':
          return graphData.length > 0
            ? graphData
                .filter(
                  (value) =>
                    value.consumer_category !== graphData[0]?.consumer_category &&
                    value.consumer_category !== graphData[1]?.consumer_category &&
                    value.consumer_category !== graphData[2]?.consumer_category
                )
                .reduce(
                  (sum, value) => sum + value.arrears__13_24_months_ + value.arrears___24_months_,
                  0
                )
            : 0
      }
    }
  }

  const arrearCount = (range: string) => {
    switch (range) {
      case 'Total':
        return graphValues?.data.reduce((sum, value) => sum + value.total_arrears, 0)
      case '0-3':
        return graphValues?.data.reduce((sum, value) => sum + value.arrears__0_3_months_, 0)
      case '4-6':
        return graphValues?.data.reduce((sum, value) => sum + value.arrears__4_6_months_, 0)
      case '7-12':
        return graphValues?.data.reduce((sum, value) => sum + value.arrears__7_12_months_, 0)
      case '>12':
        return graphValues?.data.reduce(
          (sum, value) => sum + value.arrears__13_24_months_ + value.arrears___24_months_,
          0
        )
    }
  }

  const data = [
    {
      name: graphData[0]?.consumer_category,
      value: filters(0),
    },
    {
      name: graphData[1]?.consumer_category,
      value: filters(1),
    },
    {
      name: graphData[2]?.consumer_category,
      value: filters(2),
    },
    {
      name: 'Other',
      value: filters(3),
    },
  ]
  const totalCount = filters(0) + filters(1) + filters(2) + filters(3)

  const findPercentage = (value: string) => {
    const total = graphValues?.data.reduce((sum, value) => sum + value.total_arrears, 0)
    switch (value) {
      case '0-3':
        return total != null && graphValues?.data != null
          ? (graphValues?.data.reduce((sum, value) => sum + value.arrears__0_3_months_, 0) /
              total) *
              100
          : 0
      case '4-6':
        return total != null && graphValues?.data != null
          ? (graphValues?.data.reduce((sum, value) => sum + value.arrears__4_6_months_, 0) /
              total) *
              100
          : 0
      case '7-12':
        return total != null && graphValues?.data != null
          ? (graphValues?.data.reduce((sum, value) => sum + value.arrears__7_12_months_, 0) /
              total) *
              100
          : 0
      case '>12':
        return total != null && graphValues?.data != null
          ? (graphValues?.data.reduce(
              (sum, value) => sum + value.arrears__13_24_months_ + value.arrears___24_months_,
              0
            ) /
              total) *
              100
          : 0
    }
  }
  const findSubset = () => {
    switch (range) {
      case '0-3':
        return 'Arrears (0-3 Months) - All Categories'
      case '4-6':
        return 'Arrears (4-6 Months) - All Categories'

      case '7-12':
        return 'Arrears (7-12 Months) - All Categories'

      case '>12':
        return 'Arrears (>12 Months) - All Categories'
      case 'Total':
        return 'Arrears - All Categories'
      default:
        return []
    }
  }
  const handleGraphSelection = useCallback(
    (data: { name: string | null }) => {
      const excludedCategories = [
        graphData[0]?.consumer_category,
        graphData[1]?.consumer_category,
        graphData[2]?.consumer_category,
      ]
      router.get(
        route('data-explorer', {
          subsetGroup: 'Arrear Summary',
          subset: findSubset(),
          voltage: 'HT',
          month: dateToYearMonth(selectedMonth),
          consumer_category: data.name === 'Other' ? '' : data.name,
          consumer_category_not_in:
            data.name === 'Other'
              ? `${excludedCategories.filter((category) => category).join(',')}`
              : '',
          route: route('finance.index'),
        })
      )
    },
    [selectedMonth, graphData]
  )
  return (
    <DashboardCardLayout
      title='Arrears Age-wise, HT'
      showTrend={false}
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      moreUrl={`/data-explorer/Arrear Summary?month=${dateToYearMonth(selectedMonth)}&voltage=HT&route=${route('finance.index')}`}
    >
      {selectedLevel === 'overview' && (
        <div className='flex w-full flex-col space-x-1 p-2 md:flex-row'>
          <div className='flex w-full justify-end md:hidden'>
            <button
              className='small-1stop mb-auto cursor-pointer justify-end'
              onClick={handleToogleNumber}
            >
              {toggleValue ? <ToogleNumber /> : <TooglePercentage />}
            </button>
          </div>
          <div className='flex flex-col gap-1 pt-4 md:w-1/2'>
            <div className='flex flex-col border p-2'>
              <p className='xlmetric-1stop'>
                {graphValues?.data.length ? formatNumber(arrearCount('Total') ?? 0) : <Skeleton />}
              </p>
              <div className='flex flex-row justify-between'>
                <p className='small-1stop-header'>Total Arrears</p>
                <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                  <input
                    defaultChecked
                    type='radio'
                    name='radioHT'
                    value='Total'
                    checked={range === 'Total'}
                    onChange={() => setRange('Total')}
                    className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
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
                      `${findPercentage('0-3')?.toFixed(2)}%`
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
                      name='radioHT'
                      value='0-3'
                      onChange={() => setRange('0-3')}
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
                      `${findPercentage('4-6')?.toFixed(2)}%`
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
                      name='radioHT'
                      value='4-6'
                      onChange={() => setRange('4-6')}
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
                      `${findPercentage('7-12')?.toFixed(2)}%`
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
                      name='radioHT'
                      value='7-12'
                      onChange={() => setRange('7-12')}
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
                      `${findPercentage('>12')?.toFixed(2)}%`
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
                      name='radioHT'
                      value='>12'
                      onChange={() => setRange('>12')}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Graph */}
          <div className='relative flex flex-col justify-center md:w-1/2'>
            <div className='hidden w-full justify-end md:flex'>
              <button
                className='small-1stop mb-auto cursor-pointer justify-end'
                onClick={handleToogleNumber}
              >
                {toggleValue ? <ToogleNumber /> : <TooglePercentage />}
              </button>
            </div>
            {isLoading ? (
              <Skeleton
                circle={true}
                height={200}
                width={200}
              />
            ) : (
              <ResponsiveContainer
                className='small-1stop'
                height={300}
              >
                <PieChart
                  width={100}
                  height={100}
                >
                  <Tooltip
                    formatter={(value: number) => `${formatNumber(value)}`}
                    content={
                      <CustomTooltip
                        valueType={toggleValue ? 'count' : 'percentage'}
                        totalCount={totalCount}
                        isPercent
                      />
                    }
                  />

                  <Pie
                    data={data}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey='value'
                    stroke='none'
                    onClick={handleGraphSelection}
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
    </DashboardCardLayout>
  )
}
export default ArriersHT
