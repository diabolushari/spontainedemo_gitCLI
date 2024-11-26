import React from 'react'
import { FormFieldProp } from '../ui_interfaces'

interface DatePickerProp extends FormFieldProp {
  min?: string
  max?: string
}

export default function DatePicker({
  label,
  value,
  error,
  setValue,
  placeholder,
  min,
  max,
  disabled = false,
}: DatePickerProp) {
  return (
    <>
      <label className='small-1stop-header mb-1 leading-tight tracking-normal text-gray-800'>
        {label}
      </label>
      <input
        type='date'
        value={value}
        min={min}
        max={max}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className='small-1stop-header date-picker-input rounded border border-gray-300 bg-transparent px-3 py-3 text-gray-800 shadow-sm focus:border-indigo-700 focus:outline-none disabled:bg-gray-100'
        disabled={disabled}
      />
      {error && <div className='error-text'>{error}</div>}
    </>
  )
}
