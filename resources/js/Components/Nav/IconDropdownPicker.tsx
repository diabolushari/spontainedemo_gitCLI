// resources/js/Components/ui/IconDropdownPicker.tsx

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

// ShadCN UI component imports (adjust paths if needed)
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'

// Your app's specific hooks and components (adjust paths if needed)
import { useIconPicker } from '@/Components/Nav/useIconPicker'
import { IconRenderer } from '@/Components/Nav/IconRenderer'

interface IconDropdownPickerProps {
  value: string
  onChange: (iconName: string) => void
}

export function IconDropdownPicker({ value, onChange }: IconDropdownPickerProps) {
  const { icons } = useIconPicker()
  const [search, setSearch] = React.useState('')

  const filteredIcons = React.useMemo(() => {
    if (!search) return icons
    return icons.filter((icon) => icon.friendly_name.toLowerCase().includes(search.toLowerCase()))
  }, [search, icons])

  const selectedIcon = icons.find((icon) => icon.name === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          className='w-full justify-between'
        >
          {selectedIcon ? (
            <div className='flex items-center gap-2'>
              <IconRenderer
                icon={selectedIcon.name}
                className='h-4 w-4'
              />
              {selectedIcon.friendly_name}
            </div>
          ) : (
            'Select an icon...'
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='z-[9999] w-[--radix-dropdown-menu-trigger-width] p-0'
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {/* Search Input - NOW FIXED */}
        <Input
          placeholder='Search icons...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='m-2 w-[calc(100%-1rem)]'
        />
        {/* Scrollable Icon List */}
        <div className='max-h-60 overflow-y-auto'>
          {filteredIcons.length > 0 ? (
            filteredIcons.map((icon) => (
              <DropdownMenuItem
                key={icon.name}
                onSelect={() => {
                  onChange(icon.name)
                  setSearch('')
                }}
              >
                <IconRenderer icon={icon.name} />
                <span>{icon.friendly_name}</span>
                {value === icon.name && <Check className='ml-auto text-blue-600' />}
              </DropdownMenuItem>
            ))
          ) : (
            <div className='py-4 text-center text-sm text-neutral-500'>No icons found.</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
