import React from 'react'
import { FormFieldProp } from '../ui_interfaces'
import ErrorText from '@/typography/ErrorText'

export default function ColorInput({
  label,
  value,
  error,
  setValue,
  disabled = false,
  readonly = false,
  required = false,
}: FormFieldProp) {
  return (
    <div className='flex flex-col'>
      {label != null && (
        <label className='small-1stop mb-1 tracking-normal text-gray-800'>{label}</label>
      )}
      <div className='flex items-center gap-3'>
        {/* Color Picker */}
        <input
          type='color'
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          readOnly={readonly}
          required={required}
          className='h-11 w-16 cursor-pointer rounded border border-gray-300 bg-white p-1'
        />
        {/* Show Hex Value */}
        <input
          type='text'
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          readOnly={readonly}
          required={required}
          className='rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-700 focus:outline-none'
        />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
