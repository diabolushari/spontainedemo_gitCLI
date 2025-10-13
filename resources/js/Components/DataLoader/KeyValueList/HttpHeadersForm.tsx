import { KeyValue } from '@/interfaces/data_interfaces'
import { Dispatch, memo, SetStateAction, useCallback, useMemo } from 'react'
import HttpHeaderForm from './HttpHeaderForm'
import { commonHttpHeaders } from './httpHeadersSuggestions'

interface Props {
  list: KeyValue[]
  setList: Dispatch<SetStateAction<KeyValue[]>>
  errorsKey?: string
  placeholder?: {
    key?: string
    value?: string
  }
}

function HttpHeadersForm({
  list,
  setList,
  errorsKey = '',
  placeholder = { key: 'Header name (e.g., Authorization)', value: 'Header value' },
}: Readonly<Props>) {
  const handleHeaderChange = useCallback(
    (index: number, updatedHeader: KeyValue) => {
      setList((oldValues) => {
        return oldValues.map((header, i) => (i === index ? updatedHeader : header))
      })
    },
    [setList]
  )

  const handleRemoveHeader = useCallback(
    (index: number) => {
      setList((oldValues) => {
        return oldValues.filter((_, i) => i !== index)
      })
    },
    [setList]
  )

  const addNewHeader = () => {
    setList((oldValues) => {
      return [...oldValues, { key: '', value: '' }]
    })
  }

  const keySuggestions = useMemo(() => {
    return commonHttpHeaders.map((headerItem) => ({
      value: headerItem.key,
      label: headerItem.key,
      description: headerItem.description,
    }))
  }, [])

  return (
    <div className='flex flex-col gap-1 p-2'>
      {list.map((header, index) => (
        <HttpHeaderForm
          key={index}
          header={header}
          onChange={(updatedHeader) => handleHeaderChange(index, updatedHeader)}
          onRemove={() => handleRemoveHeader(index)}
          errorKey={`${errorsKey}.${index}`}
          placeholder={placeholder}
          showRemoveButton={true}
          keySuggestions={keySuggestions}
        />
      ))}
      <div className='flex'>
        <button
          className='text-blue-600 hover:text-blue-800'
          type='button'
          onClick={addNewHeader}
        >
          Add new
        </button>
      </div>
    </div>
  )
}

export default memo(HttpHeadersForm)
