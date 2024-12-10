import React from 'react'
import { TooltipProps } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

type ValueTypeOption = 'count' | 'percentage' | 'voltage'

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  valueType?: ValueTypeOption
}

export const CustomTooltip = ({
  active,
  payload,
  valueType = 'count',
  label,
}: CustomTooltipProps & { label?: string }) => {
  if (active && payload && payload[0]) {
    return (
      <div className='rounded-xl border-2 bg-white py-2'>
        {label && <div className='small-1stop mx-2 mb-2 font-bold'>{label}</div>}

        <div>
          {payload.map((pld) => (
            <div
              className='flex w-full flex-col'
              key={pld.dataKey}
            >
              <div className='px-2'>
                {pld.dataKey && (
                  <span className='small-1stop'>
                    {pld.name} :{' '}
                    <span className='small-1stop font-bold'>
                      {valueType === 'percentage'
                        ? `${Number(pld.value).toFixed(2)}%`
                        : valueType === 'voltage'
                          ? `${Number(pld.value).toFixed(2)}`
                          : pld.value}
                    </span>
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
