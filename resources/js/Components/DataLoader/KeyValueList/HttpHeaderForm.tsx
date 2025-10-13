import { KeyValue } from '@/interfaces/data_interfaces'
import { usePage } from '@inertiajs/react'
import { memo, useCallback, useMemo } from 'react'
import { SuggestionItem, SuggestionsInput } from './SuggestionsInput'
import { getHeaderValueSuggestions } from './httpHeadersSuggestions'

interface Props {
  header: KeyValue
  onChange: (header: KeyValue) => void
  onRemove?: () => void
  placeholder?: {
    key?: string
    value?: string
  }
  errorKey?: string
  showRemoveButton?: boolean
  keySuggestions: SuggestionItem[]
}

function HttpHeaderForm({
  header,
  onChange,
  onRemove,
  placeholder = { key: 'Header name (e.g., Authorization)', value: 'Header value' },
  errorKey = '',
  showRemoveButton = true,
  keySuggestions,
}: Readonly<Props>) {
  const { errors } = usePage().props as { errors: Record<string, string | undefined> }

  const valueSuggestions = useMemo(() => {
    return getHeaderValueSuggestions(header.key).map((value) => ({
      value,
      label: value,
    }))
  }, [header.key])

  const handleKeyChange = useCallback(
    (key: string) => {
      const updatedHeader = { ...header, key }
      onChange(updatedHeader)
    },
    [header, onChange]
  )

  const handleValueChange = useCallback(
    (value: string) => {
      const updatedHeader = { ...header, value }
      onChange(updatedHeader)
    },
    [header, onChange]
  )

  return (
    <div className='flex w-full items-end gap-2'>
      <div className='grid grow grid-cols-2 gap-1'>
        <div className='flex flex-col'>
          <SuggestionsInput
            value={header.key}
            onValueChange={handleKeyChange}
            items={keySuggestions}
            placeholder={placeholder.key}
            error={errors[`${errorKey}.key`] ?? undefined}
          />
        </div>
        <div className='flex flex-col'>
          <SuggestionsInput
            value={header.value ?? ''}
            onValueChange={handleValueChange}
            items={valueSuggestions}
            placeholder={placeholder.value}
            error={errors[`${errorKey}.value`] ?? undefined}
          />
        </div>
      </div>
      {showRemoveButton && onRemove && (
        <button
          className='shrink-0 p-2 hover:bg-gray-100'
          type='button'
          onClick={onRemove}
        >
          <i className='la la-close' />
        </button>
      )}
    </div>
  )
}

export default memo(HttpHeaderForm)
