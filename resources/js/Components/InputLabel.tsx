import { LabelHTMLAttributes } from 'react'

export default function InputLabel({
  value,
  className = '',
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
  return (
    <label
      {...props}
      className={`body-1stop block text-sm text-gray-700 ` + className}
    >
      {value ? value : children}
    </label>
  )
}
