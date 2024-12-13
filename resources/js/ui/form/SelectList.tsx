import React, { useMemo } from 'react'
import { FormFieldProp } from '../ui_interfaces'
import ErrorText from '@/typography/ErrorText'

export interface Properties<
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
> extends FormFieldProp {
  list: T[]
  dataKey: K
  displayKey: G
  showAllOption?: boolean
  allOptionText?: string
  showLabel?: boolean
  style?: string
}

const getStyle = (style: string | undefined) => {
  switch (style) {
    case 'normal': {
      return ` w-full appearance-none rounded-lg border border-gray-300 py-3 pl-3 text-sm text-gray-800
      shadow-sm focus:border-indigo-700 focus:outline-none disabled:bg-gray-100`
    }

    case '1stop-small': {
      return ` w-full appearance-none rounded-lg border border-gray-300 pl-3 small-1stop text-gray-800
        shadow-sm focus:border-indigo-700 focus:outline-none disabled:bg-gray-100`
    }
    case '1stop-background': {
      return ` w-full appearance-none rounded-lg bg-1stop-alt-gray border border-gray-300 pl-3 small-1stop text-gray-800
          shadow-sm focus:border-indigo-700 focus:outline-none disabled:bg-gray-100`
    }

    case '1stop-large': {
      return ` w-full appearance-none border-transparent rounded-lg pl-3 small-1stop xlmetric-1stop bg-transparent
            shadow-sm focus:border-transparent focus:outline-none disabled:bg-gray-100`
    }

    case 'bottom-border': {
      return `mt-0 block w-full border-0 border-b-2 border-gray-200 bg-neutral-50 px-0.5 bodybold text-sm focus:border-black focus:ring-0`
    }
    case 'dark': {
      return 'w-full appearance-none rounded border border-transparent bg-white py-3 pl-3 text-sm text-gray-800 focus:border-indigo-700  focus:outline-none dark:bg-gray-800 dark:text-gray-100'
    }
    default: {
      return ''
    }
  }
}

export default function SelectList<
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
>({
  value,
  label,
  error,
  setValue,
  list,
  dataKey,
  displayKey,
  showAllOption = false,
  allOptionText,
  style = 'normal',
  disabled = false,
  showLabel = true,
}: Properties<K, G, U, V, T>) {
  const selectedOption = useMemo(() => {
    const index = list.findIndex((item) => {
      return item[dataKey] == value
    })
    return index === -1 ? '' : value
  }, [value, dataKey, list])

  return (
    <>
      {label != null && showLabel && <label className='standard-label small-1stop'>{label}</label>}
      <select
        name='type'
        value={selectedOption}
        onChange={(e) => setValue(e.target.value)}
        className={getStyle(style)}
        disabled={disabled}
      >
        {showAllOption && <option value=''>{allOptionText}</option>}
        {!showAllOption && label != null && (
          <option
            value=''
            disabled
          >
            Select {label}
          </option>
        )}
        {list.map((item: T) => {
          return (
            <option
              value={item[dataKey]}
              key={item[dataKey]}
            >
              {item[displayKey]}
            </option>
          )
        })}
      </select>
      {error && <ErrorText>{error}</ErrorText>}
    </>
  )
}
