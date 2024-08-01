import BackButton from '@/ui/button/BackButton'
import Heading from '@/typograpy/Heading'
import React from 'react'
import AddButton from '@/ui/button/AddButton'

interface Props {
  title: string
  backUrl?: string
  addUrl?: string
}

export default function CardHeader({ title, backUrl, addUrl }: Props) {
  return (
    <div className='flex gap-5 flex-wrap bg-gray-200 py-4 px-4 justify-between items-center'>
      <div className='flex gap-5 items-center'>
        {backUrl != null && <BackButton link={backUrl} />}
        <Heading>{title}</Heading>
      </div>
      {addUrl != null && <AddButton link={addUrl} />}
    </div>
  )
}
