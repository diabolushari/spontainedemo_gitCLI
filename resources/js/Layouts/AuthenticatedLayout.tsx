import { ReactNode, useCallback, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { showError, showSuccess } from '@/ui/alerts'
import { usePage } from '@inertiajs/react'
import { LaravelFlash } from '@/ui/ui_interfaces'
import * as motion from 'framer-motion/client'
import { Menu } from 'lucide-react'
import ApplicationLogo from '@/Components/ApplicationLogo'
import DashboardSidebar from '@/Layouts/DashboardSidebar'

interface Props {
  children?: ReactNode
}

export default function AuthenticatedLayout({ children }: Props) {
  const [showSidebar, setShowSidebar] = useState(false)

  const { flash } = usePage().props as unknown as { flash?: LaravelFlash }

  const toggle = useCallback(() => {
    setShowSidebar((old) => !old)
  }, [])

  const logout = () => {
    console.log(showSidebar)
  }

  useEffect(() => {
    if (flash?.error != null) {
      showError(flash.error)
    }
    if (flash?.message != null) {
      showSuccess(flash.message)
    }
  }, [flash])

  return (
    <div className='min-h-screen'>
      <ToastContainer
        position='bottom-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
        toastClassName='toast-container'
      />
      <nav className='fixed inset-0 z-50 flex h-20 items-center justify-between bg-1stop-accent1 px-2 shadow lg:px-10'>
        <div
          className='hover:text-primary-700 cursor-pointer rounded p-2 transition duration-300 hover:bg-gray-400'
          onClick={toggle}
        >
          <Menu size={20} />
        </div>
        <ApplicationLogo className='h-16 w-auto fill-current text-gray-500' />
      </nav>
      <DashboardSidebar
        showSideBar={showSidebar}
        setShowSideBar={setShowSidebar}
      />
      <div
        className={`w-full pt-20 transition-[padding] duration-300 ${
          showSidebar ? 'lg:pl-72' : 'pl-0'
        }`}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 100 }}
          transition={{ duration: 0.3 }}
        >
          <main className='w-full pb-10'>{children}</main>
        </motion.div>
      </div>
    </div>
  )
}
