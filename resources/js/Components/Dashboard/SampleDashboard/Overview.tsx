import React, { useState } from 'react'
import OverviewChart from './OverviewComponent/OverviewChart'
import OverviewGrid from './OverviewComponent/OverviewGrid'
import AddGridItemModal from './OverviewComponent/AddGridItemModal'

interface Props {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  content: any
  subsetGroupId: number
}

export default function Overview({
  selectedMonth,
  setSelectedMonth,
  content,
  subsetGroupId,
}: Props) {
  // Destructure content for easier access and handle potential null/undefined content
  const { title, card_type, overview_chart, overview_table } = content || {}

  const [isModalOpen, setIsModalOpen] = useState(false)

  function handleOpenModal() {
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
  }

  // Placeholder for adding a chart
  function handleOpenAddChartModal() {
    // TODO: Implement logic to open a chart configuration modal
    alert('Add Chart functionality not yet implemented.')
  }

  function handleAddNewItem(newItemConfig: any) {
    console.log('A new item was configured and saved!', newItemConfig)
    // TODO: Add logic here to update the state that feeds the `OverviewGrid`.
    // For example, you might call a mutation to save the new item and refetch data.
  }

  // Determine which components to show based on card_type
  const showTable = card_type === 'chart_and_table' || card_type === 'table'
  const showChart = card_type === 'chart_and_table' || card_type === 'chart'

  return (
    <>
      <div className='flex min-h-56 w-full flex-col pr-4 transition-all duration-300'>
        <div className='mt-4 flex w-full justify-start p-2'>
          <span className='subheader-sm-1stop'>{title}</span>
        </div>

        <div
          className={`grid ${card_type === 'chart_and_table' ? 'grid-cols-1 gap-4 md:grid-cols-2' : 'grid-cols-1'}`}
        >
          {/* --- Table / Grid Section --- */}
          {showTable && (
            <div className='flex-1 rounded-md border border-gray-200'>
              {overview_table ? (
                <OverviewGrid
                  config={overview_table}
                  onAdd={handleOpenModal} // Trigger for existing grid
                  selectedMonth={selectedMonth}
                />
              ) : (
                // Placeholder when grid is null, reusing the same modal trigger
                <div className='flex h-full min-h-[200px] w-full items-center justify-center rounded-md border-dashed border-gray-300 bg-gray-50'>
                  <button
                    onClick={handleOpenModal} // Trigger for new grid
                    className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  >
                    Add Grid Item
                  </button>
                </div>
              )}
            </div>
          )}

          {/* --- Chart Section --- */}
          {showChart && (
            <div className='flex-1 rounded-md border border-gray-200'>
              {overview_chart ? (
                <OverviewChart
                  chart_content={overview_chart}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                />
              ) : (
                // Placeholder for adding a chart
                <div className='flex h-full min-h-[200px] w-full items-center justify-center rounded-md border-dashed border-gray-300 bg-gray-50'>
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

      {/* The same modal is used for adding the first item or subsequent items */}
      <AddGridItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddNewItem}
        subsetGroupId={subsetGroupId}
      />
    </>
  )
}
