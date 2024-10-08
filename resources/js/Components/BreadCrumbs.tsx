import React from 'react'
import { Link } from '@inertiajs/react'

const BreadCrumbs = ({ item, searchLink }) => {
  return (
    <div className='flex'>
      <Link
        href={searchLink}
        className='small-1stop cursor-pointer'
      >
        {item} search
      </Link>
      <span className='small-1stop mx-2'>{'>'}</span>
      <span className='small-1stop font-bold'>{item} detail</span>
    </div>
  )
}

export default BreadCrumbs
