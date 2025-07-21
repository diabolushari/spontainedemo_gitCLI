import { KeyValue } from '@/interfaces/data_interfaces'
import { Dispatch, memo, SetStateAction, useCallback } from 'react'
import Input from '@/ui/form/Input'
import { usePage } from '@inertiajs/react'

interface Props {
  list: KeyValue[]
  setList: Dispatch<SetStateAction<KeyValue[]>>
  errorsKey?: string
  placeholder?: {
    key?: string
    value?: string
  }
}

function KeyValueList({ list, setList, errorsKey = '', placeholder }: Readonly<Props>) {
  const { errors } = usePage().props as { errors: Record<string, string | undefined> }

  const changeKey = useCallback(
    (itemIndex: number, key: string) => {
      setList((oldValues) => {
        return oldValues.map((item, index) => {
          if (index === itemIndex) {
            return {
              ...item,
              key,
            }
          }
          return item
        })
      })
    },
    [setList]
  )

  const changeValue = useCallback(
    (itemIndex: number, value: string) => {
      setList((oldValues) => {
        return oldValues.map((item, index) => {
          if (index === itemIndex) {
            return {
              ...item,
              value,
            }
          }
          return item
        })
      })
    },
    [setList]
  )

  const removeItem = useCallback(
    (itemIndex: number) => {
      setList((oldValues) => {
        return oldValues.filter((_, index) => index !== itemIndex)
      })
    },
    [setList]
  )

  const addNewItem = () => {
    setList((oldValues) => {
      return [...oldValues, { key: '', value: '' }]
    })
  }

  return (
    <div className='grid grid-cols-1 gap-1 p-2'>
      {list.map((item, index) => (
        <div
          className='flex items-end gap-2'
          key={index}
        >
          <div className='grid grow grid-cols-2 gap-1'>
            <div className='flex flex-col'>
              <Input
                setValue={(value) => changeKey(index, value)}
                value={item.key}
                error={errors[`${errorsKey}.${index}.key`] ?? undefined}
                placeholder={placeholder?.key ?? 'Parameter name (e.g., user_id)'}
              />
            </div>
            <div className='flex flex-col'>
              <Input
                setValue={(value) => changeValue(index, value)}
                value={item.value ?? ''}
                error={errors[`${errorsKey}.${index}.value`] ?? undefined}
                placeholder={placeholder?.value ?? 'Parameter value'}
              />
            </div>
          </div>
          <button
            className='shrink-0 p-2 hover:bg-1stop-accent2'
            type='button'
            onClick={() => removeItem(index)}
          >
            <i className='la la-close' />
          </button>
        </div>
      ))}
      <div className='flex'>
        <button
          className='link'
          type='button'
          onClick={addNewItem}
        >
          Add new
        </button>
      </div>
    </div>
  )
}

export default memo(KeyValueList)
