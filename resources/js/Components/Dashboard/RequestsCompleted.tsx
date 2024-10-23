import React from 'react'

const RequestsCompleted = () => {
  return (
    <div className='rounded-lg bg-white p-4'>
      <h2 className='h1-1stop'>33/64</h2>
      <p className='body-1stop'>Requests Completed</p>
      <p className='body-1stop'> Within SLA</p>
      <div className='mt-4 flex space-x-8'>
        <div className='mt-4'>
          <p>
            <span className='h3-1stop mb-4'>12</span> Days
          </p>
          <p className='small-1stop font-bold'>Avg Pendancy</p>
          <p className='small-1stop font-bold'> Within SLA</p>
        </div>
        <div className='mt-4'>
          <p>
            <span className='h3-1stop'>27</span> Days
          </p>
          <p className='small-1stop font-bold'>Pendency </p>
          <p className='small-1stop font-bold'>Beyond SLA</p>
        </div>
      </div>
      <p className='small-1stop-header mt-10 text-right'>Last Updated 10/09/2024 05:30AM</p>
    </div>
  )
}

export default RequestsCompleted
