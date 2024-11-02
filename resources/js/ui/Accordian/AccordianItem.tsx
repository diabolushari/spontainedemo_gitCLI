import React, { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

interface Properties {
  children: React.ReactNode
  title: string
  onAccortdionClick: () => void
  isOpen?: boolean
}

const AccordionItem = ({ title, children, isOpen, onAccortdionClick }: Properties) => {
  return (
    // <div>
    <div className={`rounded-2xl bg-white transition duration-200 ease-in-out`}>
      <div
        className={`${
          isOpen ? 'border-b-2' : ''
        } body-1stop flex w-full justify-between px-2 py-2 text-slate-700`}
        onClick={onAccortdionClick}
      >
        <div className='flex flex-col gap-2 px-4 py-1 md:flex-row md:gap-10'>
          <span className='small-1stop'>
            <b>{title}</b>
          </span>
        </div>
        <ChevronDownIcon
          className={`${
            isOpen
              ? 'rotate-180 transition-transform duration-200 ease-linear'
              : 'transition-transform duration-200 ease-linear'
          } ml-auto h-5 w-5 self-center rounded-lg`}
        />
      </div>
      {isOpen && (
        <div className='flex flex-col gap-3 px-4 pb-2 pt-4 text-sm text-slate-700'>{children}</div>
      )}
    </div>
    // </div>
  )
}

export default AccordionItem
