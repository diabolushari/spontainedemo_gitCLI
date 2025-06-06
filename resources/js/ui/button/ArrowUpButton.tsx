import React from 'react'
import { router } from '@inertiajs/react'
import ButtonBorderIcon from './ButtonBorderIcon'
import { ArrowUpIcon } from 'lucide-react'

interface Props {
  link?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
  buttonText?: string
}

export default function ArrowUpButton({ link, onClick, buttonText }: Props) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (link != null) {
      router.get(link)
      return
    }
    if (onClick != null) {
      onClick(event)
    }
  }

  return (
    <ButtonBorderIcon onClick={handleClick}>
      <div className='body-1stop flex flex-col items-center'>
        <ArrowUpIcon className='h-6 w-6' />
        {buttonText}
      </div>
    </ButtonBorderIcon>
  )
}
