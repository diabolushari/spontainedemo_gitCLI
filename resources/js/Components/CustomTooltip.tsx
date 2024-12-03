import React from 'react'
import { TooltipProps } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

export const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload[0]) {
    return (
      <div className='rounded-xl border-2 bg-white py-2'>
        <div>
          {payload?.map((pld) => (
            <div
              className='flex w-full flex-col'
              key={pld.dataKey}
            >
              <div className='px-4'>
                {pld.dataKey && (
                  <span className='small-1stop'>
                    {pld.name} : <span className='small-1stop font-bold'>{pld.value}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
