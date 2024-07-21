import { cn } from '@/utils'
import React from 'react'

interface Props {
  className?: string
  children: React.ReactNode
}

export default function NormalText({ className = '', children }: Props) {
  return <span className={cn(' ', className)}>{children}</span>
}
