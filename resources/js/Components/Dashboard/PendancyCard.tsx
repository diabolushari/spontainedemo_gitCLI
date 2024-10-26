import React, { useState } from 'react'
import SelectList from '@/ui/form/SelectList'

const PendancyCard = () => {
  const [title, setTitle] = useState('')
  const categoryList = [{ name: 'test 1' }, { name: 'test 2' }]
  const tariffList = [{ name: 'test 1' }, { name: 'test 2' }]
  return (
    <div className='rounded-lg bg-white p-4'>
      <div className='h3-1stop pl-10 pt-10'>Pendancy Beyond SLA</div>
      <div className='flex w-full flex-col gap-2 p-2'>
        <div className='flex justify-end'>
          <div className='mr-7 flex w-48 flex-col'>
            <SelectList
              setValue={() => setTitle}
              list={categoryList}
              dataKey='name'
              displayKey='name'
              label='ALL CATEGORIES'
              showAllOption
              value={title}
            />
          </div>
        </div>
        <div className='flex justify-end'>
          <div className='mr-7 flex w-48 flex-col pt-2'>
            <SelectList
              setValue={() => setTitle}
              list={tariffList}
              dataKey='name'
              displayKey='name'
              label='ALL TARIFFS'
              showAllOption
              value={title}
            />
          </div>
        </div>
      </div>
      <div className='flex justify-center p-5'>
        <img
          src='SLA.png'
          alt=''
        />
      </div>
    </div>
  )
}

export default PendancyCard
