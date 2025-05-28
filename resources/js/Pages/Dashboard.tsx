import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { PageProps } from '@/types'
import { useState } from 'react'

export default function Dashboard({ auth }: PageProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <AuthenticatedLayout>
      <div className='py-12'>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='overflow-hidden bg-white shadow-sm sm:rounded-lg'>
            <div className='p-6 text-gray-900'></div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
