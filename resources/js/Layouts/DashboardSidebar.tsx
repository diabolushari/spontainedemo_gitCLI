import DashboardSidebarLinks from './DashboardSidebarLinks'
import * as motion from 'framer-motion/client'
import { ChevronLeft } from 'lucide-react'

interface Properties {
  showSideBar: boolean
  setShowSideBar: (showSideBar: boolean) => void
}

const DashboardSidebar = ({ showSideBar, setShowSideBar }: Properties) => {
  return (
    <>
      {/* Sidebar starts */}
      {showSideBar && (
        <motion.div
          initial={{ x: -72, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -72 }}
          transition={{ duration: 0.3, delay: 0.01 }}
          className='fixed inset-0 z-40 hidden h-screen w-72 overflow-auto bg-emerald-600 pt-20 shadow lg:block'
        >
          <div className='flex flex-wrap pt-2'>
            <div className='flex w-full justify-end'>
              <button
                onClick={() => setShowSideBar(false)}
                className='cursor-pointer rounded rounded-l-md bg-header-dark p-2 text-white shadow hover:bg-gray-700'
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <DashboardSidebarLinks />
          </div>
        </motion.div>
      )}
      {/*Mobile responsive sidebar*/}
      {showSideBar && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{ duration: 0.2 }}
          exit={{
            opacity: 0,
          }}
          className='fixed inset-0 z-[60] h-screen w-full lg:hidden'
        >
          <div
            className='absolute h-full w-full bg-gray-800 opacity-50 lg:hidden'
            onClick={() => setShowSideBar(false)}
          />
          <div className='absolute z-40 h-full w-52 overflow-auto bg-emerald-600 pb-4 shadow transition duration-150 ease-in-out sm:relative md:w-96 lg:hidden'>
            <div className='flex h-full w-full flex-col justify-between'>
              <div className='flex flex-wrap pt-2'>
                <div className='flex w-full justify-end'>
                  <button
                    onClick={() => setShowSideBar(false)}
                    className='cursor-pointer rounded rounded-l-md bg-header-dark p-2 text-white shadow hover:bg-gray-700'
                  >
                    <ChevronLeft />
                  </button>
                </div>
                <DashboardSidebarLinks />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default DashboardSidebar
