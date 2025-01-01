import React from 'react'

interface Props {
  selectedValue: number
  setSelectedValue: (value: number) => void
}

export default function MonthNumberSelector({ selectedValue, setSelectedValue }: Readonly<Props>) {
  return (
    <div className='flex gap-4'>
      <button
        className={`small-1stop w-20 text-nowrap rounded-lg border border-1stop-gray p-2 ${
          selectedValue === 2 ? 'bg-1stop-accent2' : 'hover:bg-1stop-alt-gray'
        }`}
        onClick={() => setSelectedValue(2)}
      >
        3 M
      </button>
      <button
        className={`small-1stop w-20 text-nowrap rounded-lg border border-1stop-gray p-2 ${
          selectedValue === 5 ? 'bg-1stop-accent2' : 'hover:bg-1stop-alt-gray'
        }`}
        onClick={() => setSelectedValue(5)}
      >
        6 M
      </button>
      <button
        className={`small-1stop w-20 text-nowrap rounded-lg border border-1stop-gray p-2 ${
          selectedValue === 11 ? 'bg-1stop-accent2' : 'hover:bg-1stop-alt-gray'
        }`}
        onClick={() => setSelectedValue(11)}
      >
        1 Y
      </button>
    </div>
  )
}
