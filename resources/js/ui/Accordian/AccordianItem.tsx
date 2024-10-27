import React, { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

interface Properties {
  children: React.ReactNode
  title: string
  openAccordion?: string
  setOpenAccordion?: React.Dispatch<React.SetStateAction<string>>
}

const AccordionItem = ({ title, children, openAccordion, setOpenAccordion }: Properties) => {
  const [open, setOpen] = useState(false)
  const openAccordionList = () => {
    setOpen(!open)
    setOpenAccordion(code)
  }
  return (
    <div>
      <div className={`shadow-2xl transition duration-200 ease-in-out`}>
        <div
          className={`${
            open ? 'border-b-2' : ''
          } body-1stop flex w-full justify-between border-b px-2 py-2 text-sm text-black`}
          onClick={openAccordionList}
        >
          <div className='flex flex-col gap-2 px-4 py-1 md:flex-row md:gap-10'>
            <span className='text-sm'>
              <b>{title}</b>
            </span>
          </div>
          <ChevronDownIcon
            className={`${
              open
                ? 'rotate-180 transition-transform duration-200 ease-linear'
                : 'transition-transform duration-200 ease-linear'
            } ml-auto h-5 w-5 self-center rounded-lg`}
          />
        </div>
        {open && (
          <div className='flex flex-col gap-3 px-4 pb-2 pt-4 text-sm text-gray-500'>{children}</div>
        )}
      </div>
    </div>
  )
}

export default AccordionItem
