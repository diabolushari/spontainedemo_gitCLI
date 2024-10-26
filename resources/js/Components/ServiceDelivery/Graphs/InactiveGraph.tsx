import useFetchList from '@/hooks/useFetchList'
import React, { useMemo } from 'react'
import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { InactiveGraphValues } from '../ActiveConnection'

interface IBarChartLabel {
  x: number
  y: number
  width: number
  value: number
}

interface Properties {
  section_code?: string
  graphValues?: InactiveGraphValues[]
}

const InactiveGraph = ({ section_code, graphValues }: Properties) => {
  return (
    <div className='min-w-96'>
      <ResponsiveContainer
        height={150}
        width={'100%'}
      >
        <BarChart
          layout='vertical'
          width={600}
          height={600}
          data={graphValues}
        >
          <XAxis
            type='number'
            axisLine={false}
            display='none'
            padding={{ left: 0, right: 0 }}
          />
          <YAxis
            type='category'
            axisLine={false}
            height={10}
            width={120}
            dataKey='conn_status_code'
            // padding={{ bottom: 150 }}
          />

          <Bar
            dataKey='consumer_count'
            fill={'#245CC0'}
            barSize={30}
          >
            <LabelList
              dataKey='name'
              position='left'
              fill='#262626'
              fontSize={10}
              dx={-10}
            />
          </Bar>

          {/* <LabelList
                dataKey='flr_name'
                position='left'
                fill='#262626'
                fontSize={10}
                dx={-10}
              /> */}
        </BarChart>
      </ResponsiveContainer>
      {/* <p className='small-1stop my-2 text-center'>Number Of Active Connections</p> */}
    </div>
  )
}

export default InactiveGraph
