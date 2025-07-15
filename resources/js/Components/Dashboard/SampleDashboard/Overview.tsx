import React, { useEffect, useState } from 'react'
import OverviewChartComponent from './OverviewComponent/OverviewChart'
import OverviewGrid from './OverviewComponent/OverviewGrid'
import AddGridItemModal from './OverviewComponent/AddGridItemModal'
import AddChartModal from './OverviewComponent/AddChartModal'
import { OverviewChart } from '@/interfaces/data_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'

interface Props {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  content: any
  subsetGroupId: number
  blockId: number
}

export default function Overview({
  selectedMonth,
  setSelectedMonth,
  content,
  subsetGroupId,
  blockId,
}: Props) {
  const { title, card_type, overview_chart, overview_table } = content || {}

  const [isGridModalOpen, setGridModalOpen] = useState(false)
  const [isChartModalOpen, setChartModalOpen] = useState(false)
  const [editingChart, setEditingChart] = useState<OverviewChart | null>(null)
  const [editingGridItem, setEditingGridItem] = useState<any | null>(null)
  const [chartDeleteModal, setChartDeleteModal] = useState(false)
  const [overviewChart, setOverviewChart] = useState<OverviewChart | null>(overview_chart)
  const [gridItems, setGridItems] = useState<any[]>(overview_table || [])

  // --- Chart Handlers ---
  function handleOpenAddChartModal() {
    setEditingChart(null) // Ensure we are in "add" mode
    setChartModalOpen(true)
  }

  function handleOpenEditChartModal() {
    setEditingChart(overviewChart) // Set the current chart to be edited
    setChartModalOpen(true)
  }

  function handleEditGridItem(id: number) {
    setGridModalOpen(true)
    setEditingGridItem(gridItems.find((item) => item.id === id))
  }

  function handleSaveChart(newOrUpdatedChart: OverviewChart) {
    setOverviewChart(newOrUpdatedChart)
    setChartModalOpen(false)
    setEditingChart(null) // Clear editing state
  }

  // --- Grid Item Handlers ---
  function handleAddNewGridItem(newItemConfig: any) {
    setGridItems((prev) => [...prev, newItemConfig])
    setGridModalOpen(false)
  }

  const showTable = card_type === 'chart_and_table' || card_type === 'table'
  const showChart = card_type === 'chart_and_table' || card_type === 'chart'

  useEffect(() => {
    setOverviewChart(overview_chart)
  }, [overview_chart])

  useEffect(() => {
    setGridItems(overview_table)
  }, [overview_table])

  return (
    <>
      <div className='flex min-h-56 w-full flex-col pr-4 transition-all duration-300'>
        <div className='mt-4 flex w-full justify-start p-2'>
          <span className='subheader-sm-1stop'>{title}</span>
        </div>

        <div
          className={`grid ${showTable && showChart ? 'grid-cols-1 gap-4 md:grid-cols-2' : 'grid-cols-1'}`}
        >
          {/* --- Table / Grid Section --- */}
          {showTable && (
            <div className='grid grid-cols-2 gap-2'>
              {Array.isArray(gridItems) &&
                gridItems?.slice(0, 6).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={item.col_span ? 'col-span-2' : ''}
                  >
                    <OverviewGrid
                      config={item}
                      selectedMonth={selectedMonth}
                      blockId={blockId}
                    />
                  </div>
                ))}
              {(gridItems?.length < 6 || !gridItems) && (
                <button
                  onClick={() => setGridModalOpen(true)}
                  className='flex h-full min-h-[60px] w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 text-center text-indigo-600 shadow outline-none transition hover:border-indigo-500 hover:text-indigo-800 hover:shadow-lg'
                  style={{ fontSize: '1.25rem', fontWeight: 600 }}
                >
                  + Add Cell
                </button>
              )}
            </div>
          )}

          {/* --- Chart Section --- */}
          {showChart && (
            <div className='group relative flex-1 rounded-md border border-gray-200'>
              {overviewChart ? (
                <>
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
                  <OverviewChartComponent
                    chart_content={overviewChart}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                  />
                </>
              ) : (
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
          )}
        </div>
      </div>
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
      <AddChartModal
        isModalOpen={isChartModalOpen}
        setIsModalOpen={setChartModalOpen}
        subsetGroupId={subsetGroupId}
        chartToEdit={overviewChart ? overviewChart : null}
        blockId={blockId}
      />
    </>
  )
}
