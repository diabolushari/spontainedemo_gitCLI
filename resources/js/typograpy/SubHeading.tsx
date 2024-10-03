import { cn } from '@/utils'
import React from 'react'

interface Props extends React.HTMLProps<HTMLHeadingElement> {
  children: React.ReactNode
}

const SubHeading = React.forwardRef<HTMLHeadingElement, Props>(
  ({ className = '', children, ...props }: Props, ref) => {
    return (
      <h2
        ref={ref}
        className={cn('break-all font-h3-1stop', className)}
        {...props}
      >
        {children}
      </h2>
    )
  }
)

export default SubHeading
