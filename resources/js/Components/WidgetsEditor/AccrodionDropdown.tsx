// Accordion Trigger Component
import React from 'react'
import { ChevronDown } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className='flex'>
    <Accordion.Trigger
      className={`group flex flex-1 items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-left font-medium text-slate-700 transition-all hover:bg-slate-100 ${className}`}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDown
        className='h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180'
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
))

AccordionTrigger.displayName = 'AccordionTrigger'

// Accordion Content Component
export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={`overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down ${className}`}
    {...props}
    ref={forwardedRef}
  >
    <div className='space-y-4 py-4'>{children}</div>
  </Accordion.Content>
))

AccordionContent.displayName = 'AccordionContent'
