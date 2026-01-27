import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import { ArrowLeft, Edit, Trash2, Database, Layers, Plus } from 'lucide-react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import Widget from '@/Components/PageEditor/Widget'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Widget as WidgetType } from '@/interfaces/data_interfaces'

interface SubsetMaxValueResponse {
  field: string
  max_value: string | null
}

interface Props {
  widget: WidgetType
  onBack: () => void
  onAddToDashboard?: (widget: WidgetType) => void
}

export default function WidgetDetailView({ widget, onBack, onAddToDashboard }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    widget.updated_at ? new Date(widget.updated_at) : new Date()
  )

  const url = widget.data?.overview?.subset_id
    ? route('subset-field-max-value', {
        subsetDetail: widget.data.overview.subset_id,
        field: 'month',
      })
    : null

  const [maxValueData, loading] = useFetchRecord<SubsetMaxValueResponse>(url)

  useEffect(() => {
    if (!loading && maxValueData != null) {
      const maxValue = maxValueData.max_value
      if (maxValue != null && /^\d{6}$/.test(maxValue)) {
        const year = Number.parseInt(maxValue.substring(0, 4), 10)
        const month = Number.parseInt(maxValue.substring(4, 6), 10) - 1
        setSelectedMonth(new Date(year, month, 1))
      }
    }
  }, [loading, maxValueData])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Navigation / Header */}
        <div className='mb-6'>
          <button
            onClick={onBack}
            className='flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Widgets
          </button>
        </div>

        <div className='grid grid-cols-1 gap-12 lg:grid-cols-12'>
          {/* Left Column: Widget Details */}
          <div className='lg:col-span-3'>
            <h2 className='mb-6 text-lg font-bold text-gray-900'>Widget Details</h2>

            <div className='space-y-8'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-500'>Title</label>
                <p className='text-base font-semibold text-gray-900'>{widget.title}</p>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-500'>Description</label>
                <p className='text-sm text-gray-700'>
                  {widget.data?.description || 'No description added'}
                </p>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-500'>Added on</label>
                <p className='text-sm font-semibold text-gray-900'>
                  {formatDate(widget.updated_at)}
                </p>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-500'>
                  Collection name
                </label>
                <p className='text-sm font-semibold text-gray-900'>
                  {widget.collection?.name || 'Uncategorized'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Preview & Data Source */}
          <div className='lg:col-span-9'>
            <div className='space-y-6'>
              {/* Preview Card */}
              <div className='overflow-hidden rounded-xl bg-white shadow-sm'>
                {/* Header with Title and Actions */}
                <div className='flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4'>
                  <span className='inline-flex items-center rounded bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700'>
                    Preview
                  </span>

                  {/* Primary Edit Action placed here for easy access */}
                  <Link
                    href={`/widget-editor/${widget.id}/edit`}
                    className='inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  >
                    <Edit className='h-3.5 w-3.5' />
                    Edit Widget
                  </Link>
                </div>

                <div className='p-8'>
                  <div className='relative flex min-h-[600px] flex-col overflow-hidden rounded-lg border border-gray-100 bg-white p-6 shadow-sm'>
                    <div className='mb-6 flex items-start justify-between'>
                      <div>
                        <h3 className='text-lg font-bold text-gray-900'>{widget.title}</h3>
                        {widget.subtitle && (
                          <p className='text-sm text-gray-500'>{widget.subtitle}</p>
                        )}
                      </div>
                      <div className='flex gap-2'>
                        <span className='rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600'>
                          {selectedMonth.toLocaleString('default', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {widget ? (
                      <Widget
                        widget={widget}
                        anchorMonth={selectedMonth}
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center'>
                        <span className='text-gray-400'>No preview available</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Source Card */}
              <div className='overflow-hidden rounded-xl bg-white shadow-sm'>
                <div className='border-b border-gray-100 bg-gray-50/50 px-6 py-4'>
                  <span className='inline-flex items-center rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700'>
                    Data Source
                  </span>
                </div>
                <div className='p-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-4'>
                      <span className='text-sm font-medium text-gray-900'>Subset:</span>
                      <span className='inline-flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-700'>
                        <Database className='h-3.5 w-3.5' />
                        {widget.data?.overview?.subset_name ||
                          `Subset #${widget.data?.overview?.subset_id}`}
                      </span>
                    </div>

                    <div className='flex items-center gap-4'>
                      <span className='text-sm font-medium text-gray-900'>Hierarchy:</span>
                      <span className='inline-flex items-center gap-1.5 rounded-md border border-purple-100 bg-purple-50 px-3 py-1 text-sm text-purple-700'>
                        <Layers className='h-3.5 w-3.5' />
                        Hierarchy Details
                      </span>
                    </div>

                    <p className='text-sm text-gray-600'>
                      Fetched latest month and day-level performance data using the identified
                      subsets and hierarchy mapping.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className='flex items-center justify-end gap-3 pt-4'>
                <button
                  onClick={onBack}
                  className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                >
                  Close
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className='inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50'
                >
                  <Trash2 className='h-4 w-4' />
                  Delete
                </button>

                {onAddToDashboard && (
                  <button
                    onClick={() => onAddToDashboard(widget)}
                    className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
                  >
                    <Plus className='h-4 w-4' />
                    Add to Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal for Detail View */}
        {showDeleteModal && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title={`Delete ${widget.title}`}
            url={route('widget-editor.destroy', widget.id!)}
          />
        )}
      </div>
    </div>
  )
}
