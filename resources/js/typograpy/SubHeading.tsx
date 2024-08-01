import { cn } from '@/utils'
import React from 'react'

interface Props {
  className?: string
  children: React.ReactNode
}

export default function SubHeading({ className = '', children }: Props) {
  return <h2 className={cn('break-all font-bold', className)}>{children}</h2>
}
