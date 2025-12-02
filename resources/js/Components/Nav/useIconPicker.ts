import React from 'react'
import { kebabToTitleCase } from '@/Components/Nav/icons'
import { icons as iconData } from 'lucide-react'

type Icon = {
  name: string
  friendly_name: string
  Component: React.FC<React.ComponentPropsWithoutRef<'svg'>>
}

export const useIconPicker = (): { icons: Icon[] } => {
  const allIconNames = Object.keys(iconData)

  return {
    icons: allIconNames.map((iconName) => {
      const FriendlyName = kebabToTitleCase(iconName)
      return {
        name: iconName,
        friendly_name: FriendlyName,
        Component: iconData[iconName as keyof typeof iconData],
      }
    }),
  }
}
