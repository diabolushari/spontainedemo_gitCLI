import React from 'react'
import { icons, LucideProps } from 'lucide-react'

export const IconRenderer = ({ icon, ...rest }: { icon: string } & LucideProps) => {
  const IconComponent = icons[icon as keyof typeof icons]

  if (!IconComponent) {
    // Return a default icon or null
    return null
  }

  return (
    <IconComponent
      data-slot='icon'
      {...rest}
    />
  )
}
