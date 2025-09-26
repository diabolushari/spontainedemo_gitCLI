import React, { useEffect, useState } from 'react'
import AddGridItemModal from './OverviewComponent/AddGridItemModal'
import DeleteModal from '@/ui/Modal/DeleteModal'
import OverviewChartEditDrawer from '@/Components/PageBuilder/CardEditors/OverviewChartEditDrawer'
import OverviewBarChartDemo from '@/Cards/Demo/OverviewBarChartDemo'
import { Config } from '@/interfaces/data_interfaces'

interface Props {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  content: {
    overview_chart: {
      title: string
      subset_id: number
      chart_type: string
      description: string
      dimensions: {
        field: string
        label: string
        show_label: boolean
      }[]
      measures: {
        field: string
        label: string
        show_label: boolean
      }[]
    }
  }
  subsetGroupId: number
  blockId: number
  editMode?: boolean
  blockContent: Config
}

export default function Overview({
  selectedMonth,
  setSelectedMonth,
  content,
  subsetGroupId,
  blockId,
  editMode = false,
  blockContent,
}: Props) {
  const { overview_chart } = content || {}

  const [isGridModalOpen, setGridModalOpen] = useState(false)
  const [isChartModalOpen, setChartModalOpen] = useState(false)
  const [chartDeleteModal, setChartDeleteModal] = useState(false)
  const [overviewChart, setOverviewChart] = useState<any | null>(overview_chart)
  // const [gridItems, setGridItems] = useState<any[]>(overview_table || [])
  const [isChartEditDrawerOpen, setChartEditDrawerOpen] = useState(false)

  // --- Chart Handlers ---
  function handleOpenAddChartModal() {
    setChartEditDrawerOpen(true)
  }

  function handleOpenEditChartModal() {
    setChartEditDrawerOpen(true)
  }

  useEffect(() => {
    setOverviewChart(overview_chart)
  }, [overview_chart])

  // useEffect(() => {
  //   setGridItems(overview_table)
  // }, [overview_table])

  console.log('Overview Chart:', overviewChart)
  // console.log('Overview Table:', gridItems)

  return (
    <>
      <div className='flex min-h-56 w-full flex-col pr-4 transition-all duration-300'>
        {/*<div className='mt-4 flex w-full justify-start p-2'>*/}
        {/*  <span className='subheader-sm-1stop'>{title} </span>*/}
        {/*</div>*/}

        <div className='grid grid-cols-1'>
          {
            <div className='group relative flex-1 rounded-md border border-gray-200'>
              {overviewChart && (
                <>
                  {editMode && (
                    <div className='absolute right-2 top-2 z-10 flex gap-x-1 rounded-md bg-white bg-opacity-75 p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100'>
                      <button
                        onClick={handleOpenEditChartModal}
                        title='Edit Chart'
                        className='text-gray-600 hover:text-indigo-600'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path d='M12 20h9' />
                          <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />
                        </svg>
                      </button>
                      <button
                        onClick={() => setChartDeleteModal(true)}
                        title='Delete Chart'
                        className='text-gray-600 hover:text-red-600'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <polyline points='3 6 5 6 21 6' />
                          <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
                          <line
                            x1='10'
                            y1='11'
                            x2='10'
                            y2='17'
                          />
                          <line
                            x1='14'
                            y1='11'
                            x2='14'
                            y2='17'
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  <OverviewBarChartDemo
                    title={overviewChart?.title}
                    discription={overviewChart?.discription}
                    dimensions={overviewChart?.dimensions}
                    measures={overviewChart?.measures}
                    subsetId={overviewChart?.subset_id}
                  />
                </>
              )}
              {overviewChart == null && (
                <div className='flex h-full min-h-[300px] w-full items-center justify-center rounded-md bg-gray-50'>
                  <button
                    onClick={handleOpenAddChartModal}
                    className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  >
                    Add Chart
                  </button>
                </div>
              )}
            </div>
          }
        </div>
      </div>
      {isChartEditDrawerOpen && (
        <OverviewChartEditDrawer
          open={isChartEditDrawerOpen}
          setOpen={setChartEditDrawerOpen}
          initialData={blockContent}
          blockId={blockId}
        />
      )}
      {chartDeleteModal && (
        <DeleteModal
          setShowModal={setChartDeleteModal}
          title='Delete Chart'
          url={route('config.overview.chart.destroy', blockId)}
        >
          <p>Are you sure you want to delete this chart?</p>
        </DeleteModal>
      )}
      {/* --- Modals --- */}
      <AddGridItemModal
        isModalOpen={isGridModalOpen}
        setIsModalOpen={setGridModalOpen}
        subsetGroupId={subsetGroupId}
        blockId={blockId}
      />
    </>
  )
}
