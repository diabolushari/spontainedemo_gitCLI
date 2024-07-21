import { cn } from '@/utils'
import React from 'react'

interface Props {
  className?: string
  children: React.ReactNode
}

export default function StrongText({ className = '', children }: Props) {
  return <strong className={cn('break-all ', className)}>{children}</strong>
}
