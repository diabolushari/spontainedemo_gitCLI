import React from 'react'
import { FormFieldProp } from '../ui_interfaces'
import { getFormStyle } from './Input'

export default function TextArea({
  label,
  value,
  error,
  setValue,
  placeholder,
  disabled,
  style = 'normal',
}: FormFieldProp) {
  return (
    <>
      <label className='mb-1 text-sm tracking-normal text-gray-800'>{label}</label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        name='description'
        disabled={disabled}
        className={getFormStyle(style)}
      ></textarea>
      {error && <div className='error-text'>{error}</div>}
    </>
  )
}
