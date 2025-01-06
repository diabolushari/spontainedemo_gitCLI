import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { router } from '@inertiajs/react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'
import { dateToYearMonth, formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import { solidColors } from '@/ui/ui_interfaces'
import { CustomTooltip } from '@/Components/CustomTooltip'
import ToogleNumber from '@/Components/ui/ToogleNumber'
import TooglePercentage from '@/Components/ui/TogglePercentage'
import DashboardCardLayout from '@/Components/Dashboard/DashbaordCard/DashboardCardLayout'
import DashboardTrendGraph from '@/Components/Dashboard/DashbaordCard/DashboardTrendGraph'
import DashboardRankedList from '@/Components/Dashboard/DashbaordCard/DashboardRankedList'

export interface BillingValues {
  consumer_category: string
  month: string
  total_demand: number
  voltage: string
}

interface LegendProps {
  payload: {
    color: string
    type: string
    value: string
    payload: { name: string; value: number; color: string }[]
  }[]
}

export const CustomLegend = ({ payload }: LegendProps) => {
  // Calculate the total value of the dataset
  const totalValue = payload.reduce((sum, entry) => sum + entry.payload.value, 0)

  return (
    <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
      {payload.map((entry, index) => {
        const percentage = ((entry.payload.value / totalValue) * 100).toFixed(2) // Calculate percentage
        return (
          <li
            key={`item-${index}`}
            style={{ marginRight: 10, color: 'black', fontSize: '8px' }}
            className='uppercase'
          >
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                backgroundColor: entry.color,
                marginRight: 5,
              }}
            />
            {`${entry.value} (${percentage}%)`} {/* Append percentage */}
          </li>
        )
      })}
    </ul>
  )
}

const TotalBilled = () => {
  const [voltageType, setVoltageType] = useState('Total')
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [toggleValue, settoggleValue] = useState<boolean>(true)
  const [exclude, setExclude] = useState(false)

  const [selectedLevel, setSelectedLevel] = useState('overview')

  const [graphValues] = useFetchRecord<{ data: BillingValues[]; latest_value: string }>(
    `subset/120?${
      selectedMonth == null
        ? 'latest=month'
        : `month=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`
    }`
  )

  // graphValues?.data.sort((a, b) => a.total_demand - b.total_demand).reverse()
  const graphData = useMemo(() => {
    if (graphValues?.data == null) {
      return []
    }
    return [...graphValues.data]
      .sort((a, b) => a.total_demand - b.total_demand)
      .filter((value) =>
        !exclude
          ? voltageType == 'Total' || value.voltage == voltageType
          : value.voltage == voltageType && value.consumer_category != 'DOMESTIC'
      )
      .reverse()
  }, [graphValues, voltageType, exclude])
  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])

  const handleToogleNumber = () => {
    settoggleValue(!toggleValue)
  }

  const filters = (value: BillingValues, index: number) => {
    if (index < 3) {
      if (voltageType == 'Total') {
        return value.consumer_category === graphData[index].consumer_category
      } else {
        return (
          value.consumer_category === graphData[index].consumer_category &&
          value.voltage == voltageType
        )
      }
    } else {
      if (voltageType == 'Total') {
        return (
          value.consumer_category !== graphData[0]?.consumer_category &&
          value.consumer_category !== graphData[1]?.consumer_category &&
          value.consumer_category !== graphData[2]?.consumer_category
        )
      } else {
        return (
          value.consumer_category !== graphData[0]?.consumer_category &&
          value.consumer_category !== graphData[1]?.consumer_category &&
          value.consumer_category !== graphData[2]?.consumer_category &&
          value.voltage == voltageType
        )
      }
    }
  }

  const cunsumerCount = (voltage: string, region: string, exclude: boolean) => {
    if (voltage != 'Total') {
      return graphValues?.data
        .filter((value) =>
          !exclude
            ? value.voltage === voltage && value.consumer_category != region
            : value.voltage === voltage && value.consumer_category == region
        )
        .reduce((sum, value) => sum + value.total_demand, 0)
    } else {
      return graphValues?.data.reduce((sum, value) => sum + value.total_demand, 0)
    }
  }

  const graphFilter = (category: string) => {
    return graphData
      .filter(
        (value) =>
          value.consumer_category === category &&
          (voltageType === 'Total' || value.voltage === voltageType)
      )
      .reduce((sum, value) => sum + value.total_demand, 0)
  }
  const totalCount = graphValues?.data.reduce((sum, value) => sum + value.total_demand, 0)

  const data = [
    {
      name: 'DOMESTIC',
      value: graphFilter('DOMESTIC'),
    },
    {
      name: 'INDUSTRIAL',
      value: graphFilter('Industrial'),
    },
    {
      name: 'COMMERCIAL',
      value: graphFilter('Commercial'),
    },
    {
      name: 'AGRICULTURE',
      value: graphFilter('Agriculture'),
    },
    {
      name: 'OTHER',
      value:
        totalCount -
        graphFilter('DOMESTIC') -
        graphFilter('Industrial') -
        graphFilter('Commercial') -
        graphFilter('Agriculture'),
    },
  ]

  const domesticLtPercent = cunsumerCount('LT', 'DOMESTIC', true)
    ? (cunsumerCount('LT', 'DOMESTIC', true) * 100) / cunsumerCount('Total', '', false)
    : 0

  const otherLtPercent = cunsumerCount('LT', 'DOMESTIC', false)
    ? (cunsumerCount('LT', 'DOMESTIC', false) * 100) / cunsumerCount('Total', '', false)
    : 0

  const htPercent = cunsumerCount('HT', '', false)
    ? (cunsumerCount('HT', '', false) * 100) / cunsumerCount('Total', '', false)
    : 0

  const ehtPercent = cunsumerCount('EHT', '', false)
    ? (cunsumerCount('EHT', '', false) * 100) / cunsumerCount('Total', '', false)
    : 0
  const handleGraphSelection = useCallback(
    (data: { name: string | null }) => {
      const excludedCategories = ['DOMESTIC', 'Industrial', 'Commercial', 'Agriculture']

      router.get(
        route('data-explorer', {
          subsetGroup: 'Demand Analysis',
          subset: 'Demand-All Categories',
          voltage: voltageType === 'Total' ? '' : voltageType,
          month: dateToYearMonth(selectedMonth),
          consumer_category: data.name === 'OTHER' ? '' : data.name,
          consumer_category_not_in:
            data.name === 'OTHER'
              ? `${excludedCategories.filter((category) => category).join(',')}`
              : '',
          route: route('finance.index'),
        })
      )
    },
    [voltageType, selectedMonth, graphData]
  )
  const monthYear = useMemo(() => {
    return dateToYearMonth(selectedMonth)
  }, [selectedMonth])
  return (
    <DashboardCardLayout
      title='Billing/Total Demand'
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      moreUrl={`/data-explorer/Demand Summary?month=${dateToYearMonth(selectedMonth)}&route=${route('finance.index')}`}
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
            {/* Total Connections */}
            <div className='flex flex-col border p-2'>
              <p className='xlmetric-1stop'>
                {graphValues?.data.length ? (
                  formatNumber(cunsumerCount('Total', '', false) ?? 0)
                ) : (
                  <Skeleton />
                )}
              </p>
              <div className='flex flex-row justify-between'>
                <p className='small-1stop-header'>Total Demand Value</p>
                <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                  <input
                    defaultChecked
                    type='radio'
                    name='radioBilling'
                    value='Total'
                    onChange={() => {
                      setVoltageType('Total')
                      setExclude(false)
                    }}
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
                      formatNumber(cunsumerCount('LT', 'DOMESTIC', true) ?? 0)
                    ) : (
                      domesticLtPercent.toFixed(2) + '%'
                    )
                  ) : (
                    <Skeleton />
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>Domestic-LT </p>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radioBilling'
                      value='LT'
                      onChange={() => {
                        setVoltageType('LT')
                        setExclude(false)
                      }}
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
                      formatNumber(cunsumerCount('LT', 'DOMESTIC', false) ?? 0)
                    ) : (
                      otherLtPercent.toFixed(2) + '%'
                    )
                  ) : (
                    <Skeleton />
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>Others-LT </p>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radioBilling'
                      value='LT'
                      onChange={() => {
                        setVoltageType('LT')
                        setExclude(true)
                      }}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex w-full flex-row space-x-1'>
              {/* LT */}
              <div className='flex w-1/2 flex-col border p-2'>
                <p className='mdmetric-1stop'>
                  {graphValues?.data.length ? (
                    toggleValue ? (
                      formatNumber(cunsumerCount('HT', '', false) ?? 0)
                    ) : (
                      htPercent.toFixed(2) + '%'
                    )
                  ) : (
                    <Skeleton />
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>HT </p>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radioBilling'
                      value='HT'
                      onChange={() => {
                        setVoltageType('HT')
                        setExclude(false)
                      }}
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
                      formatNumber(cunsumerCount('EHT', '', false) ?? 0)
                    ) : (
                      `${ehtPercent.toFixed(2)}%`
                    )
                  ) : (
                    <Skeleton />
                  )}
                </p>
                <div className='flex flex-row justify-between'>
                  <p className='small-1stop-header'>EHT</p>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radioBilling'
                      value='EHT'
                      onChange={() => {
                        setVoltageType('EHT')
                        setExclude(false)
                      }}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Graph */}
          <div className='relative flex flex-col pt-2 md:w-1/2'>
            <div className='hidden w-full justify-end md:flex'>
              <button
                className='small-1stop mb-auto cursor-pointer justify-end'
                onClick={handleToogleNumber}
              >
                {toggleValue ? <ToogleNumber /> : <TooglePercentage />}
              </button>
            </div>
            {graphValues?.data.length ? (
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
            ) : (
              <Skeleton
                circle={true}
                height={200}
                width={200}
              />
            )}
          </div>
        </div>
      )}
      {selectedLevel === 'trend' && selectedMonth != null && (
        <DashboardTrendGraph
          subsetId={120}
          cardTitle='Trend of Top Billing/Total Demand'
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          dataField='total_demand'
          dataFieldName='Total Demand'
          filterListFetchURL={route('static-list', { type: 'voltage' })}
          filterFieldName='voltage'
          filterListKey='value'
          defaultFilterValue='LT'
          chartType='area'
        />
      )}
      {selectedLevel === 'ranking' && selectedMonth != null && (
        <DashboardRankedList
          subsetId={120}
          cardTitle='Ranked by Total Demand'
          dataField='total_demand'
          dataFieldName='Demand'
          rankingPageUrl={`office-rankings/Demand Analysis?month=${monthYear}&route=${route('finance.index')}`}
          timePeriod={monthYear}
          timePeriodFieldName='month'
        />
      )}
    </DashboardCardLayout>
  )
}
export default TotalBilled
