import React from 'react'
import Spinner from '../Spinner'
import { Link } from '@inertiajs/react'
import { cn } from '@/utils'

interface Properties {
  label: string
  onClick?: (e: React.FormEvent<HTMLButtonElement>) => void
  type?: string
  processing?: boolean
  disabled?: boolean
  link?: string
  buttonType?: 'reset' | 'submit' | 'button'
}

export const chooseButtonColor = (type: string): [string, string] => {
  switch (type) {
    case 'secondary': {
      return ['bg-gray-200 hover:bg-gray-400 focus:ring-gray-200 text-gray-700', 'text-gray-500']
    }
    case 'tertiary': {
      return ['bg-white hover:bg-primary-300 focus:ring-gray-200 text-gray-700', 'text-gray-500']
    }
    case 'info': {
      return [
        'bg-indigo-500 hover:bg-indigo-400 focus:ring-indigo-400 text-white',
        'text-gray-indigo-500',
      ]
    }
    case 'danger': {
      return ['bg-red-500 hover:bg-red-400 focus:ring-red-400 text-white', 'text-red-500']
    }
    case 'norka': {
      return [
        'w-full rounded-md bg-primary-6000 font-body text-base uppercase text-white hover:bg-primary-500',
        '',
      ]
    }
    case 'otp': {
      return [
        'w-full rounded-md bg-theme_color_1 mdButtonText uppercase text-white hover:bg-theme_color_2',
        '',
      ]
    }

    default: {
      return [
        'bg-1stop-highlight text-white hover:shadow-lg rounded hover:opacity-75 focus:ring-1',
        'text-primary-700 ',
      ]
    }
  }
}

export default function Button({
  label,
  onClick,
  type = 'primary',
  processing = false,
  disabled = false,
  buttonType = 'submit',
  link,
}: Properties) {
  const [buttonStyle, svgStyle] = chooseButtonColor(type)

  return (
    <>
      {link != null && processing != null && (
        <Link
          href={link}
          as='a'
          className={cn(
            'lgButtonText flex items-center justify-center px-8 py-2 capitalize tracking-wider transition duration-150' +
              ' ease-in-out focus:outline-none focus:ring-4',
            buttonStyle
          )}
        >
          {label}
        </Link>
      )}
      {!processing && link == null && (
        <button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'lgButtonText flex items-center justify-center px-8 py-2 capitalize tracking-wider transition duration-150' +
              ' ease-in-out focus:outline-none focus:ring-4',
            buttonStyle
          )}
          type={buttonType}
        >
          {label}
        </button>
      )}
      {processing && <Spinner svgStyle={svgStyle} />}
    </>
  )
}
