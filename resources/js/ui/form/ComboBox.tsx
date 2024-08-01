import React, { useCallback, useEffect, useRef, useState } from 'react'
import useClick from '../../hooks/useClick'
import axios from 'axios'
import { handleHttpErrors } from '../alerts'
import { getFormStyle } from './Input'
import { XIcon } from 'lucide-react'
import SubHeading from '@/typograpy/SubHeading'
import NormalText from '@/typograpy/NormalText'

interface Properties<
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
> {
  label: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  value: T | null
  setValue: (value: T | null) => unknown
  dataKey: G
  displayKey: K
  displayValue2?: K
  url: string
}

const ComboBox = <
  K extends keyof T,
  G extends keyof T,
  U extends number | string,
  V extends number | string | null,
  T extends Record<K, U> & Record<G, V>,
>({
  label,
  value,
  error,
  setValue,
  dataKey,
  displayKey,
  displayValue2,
  disabled,
  url,
}: Properties<K, G, U, V, T>) => {
  const [textFieldValue, setTextFieldValue] = useState<string>('')
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [list, setList] = useState<T[]>([])
  const listRef = useRef<HTMLDivElement | null>(null)
  const [clickTarget] = useClick()

  useEffect(() => {
    if (listRef.current?.contains(clickTarget) !== true) {
      setList([])
    }
  }, [clickTarget])

  const fetchData = useCallback(async () => {
    if (textFieldValue === '') {
      setList([])
      return
    }
    try {
      const res = await axios.get(`${url}${textFieldValue}`)
      setList(res.data)
      setHighlightedIndex(-1)
    } catch (error) {
      handleHttpErrors(error)
    }
  }, [textFieldValue, url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setTextFieldValue('')
  }, [value])

  // navigate through list with arrow keys
  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((prev) => {
        if (prev + 1 >= list.length) {
          return -1
        }
        return prev + 1
      })
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((prev) => {
        if (prev - 1 < -1) {
          return list.length - 1
        }
        return prev - 1
      })
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (list.length > 0 && highlightedIndex >= 0 && highlightedIndex < list.length) {
        setValue(list[highlightedIndex])
      }
    }
  }

  return (
    <>
      {value != null && (
        <div className='flex flex-col gap-2'>
          <div
            className='flex items-center justify-between bg-gray-100 px-3 py-2
            text-sm text-gray-800'
          >
            <span>
              {label}
              <br />
              <b>{value[displayKey]}</b>
              {displayValue2 != null && (
                <>
                  <br />
                  <b>{value[displayValue2]}</b>
                </>
              )}
            </span>
            {!disabled && (
              <div
                className='cursor-pointer rounded-full p-1 hover:bg-gray-50'
                onClick={() => setValue(null)}
              >
                <XIcon />
              </div>
            )}
          </div>
          {error != null && <div className='error-text'>{error}</div>}
        </div>
      )}
      {value == null && (
        <div
          className='relative w-full'
          ref={listRef}
        >
          <div className='flex flex-col'>
            <label className='mb-1 text-sm tracking-normal text-gray-800'>{label}</label>
            <input
              type='text'
              value={textFieldValue}
              onKeyDown={handleKeydown}
              onChange={(event) => setTextFieldValue(event.target.value)}
              className={getFormStyle('normal')}
              disabled={disabled}
              readOnly={disabled}
            />
            {error && <div className='error-text'>{error}</div>}
          </div>
          <div className='absolute top-full z-10  w-full overflow-auto rounded bg-white shadow-xl'>
            {list.length > 0 && (
              <>
                {list.map((item, index) => {
                  return (
                    <div
                      key={item[dataKey]}
                      className={`flex cursor-pointer flex-col py-3 px-2 text-sm
                        ${highlightedIndex === index ? 'bg-gray-200 font-semibold' : ''}`}
                      onClick={() => setValue(item)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <SubHeading>{item[displayKey]}</SubHeading>
                      {displayValue2 != null && (
                        <NormalText className='text-gray-500 text-xs'>
                          {item[displayValue2]}
                        </NormalText>
                      )}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ComboBox
