import React from 'react'
import { useOverviewForm } from './hooks/useOverviewForm'
import Input from '@/ui/form/Input'

// A generic modal shell component
const Modal = ({ isOpen, onClose, children, title }: any) => {
  if (!isOpen) return null
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative min-h-[200px] w-full max-w-lg rounded-lg bg-white p-6 shadow-xl'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 text-gray-400 hover:text-gray-600'
          aria-label='Close modal'
        >
          <svg
            className='h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
        {title && (
          <div className='mb-4 border-b pb-2'>
            <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  )
}

// A reusable select field for the form
const SelectField = ({ label, value, onChange, loading, disabled, children }: any) => {
  let placeholder = `Select a ${label.toLowerCase().split(' (')[0]}`
  if (disabled && !loading) {
    if (label.startsWith('Dimension (Group')) placeholder = 'Select a subset first'
    if (label.startsWith('Metric')) placeholder = 'Select a subset first'
    if (label.startsWith('Dimension Value')) placeholder = 'Select a dimension first'
  }

  return (
    <div>
      <label className='block text-sm font-medium text-gray-700'>{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className='mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:bg-gray-200 sm:text-sm'
      >
        <option
          value=''
          disabled
        >
          {loading ? 'Loading...' : placeholder}
        </option>
        {children}
      </select>
    </div>
  )
}

interface AddGridItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: any) => void
  subsetGroupId: number
}

export default function AddGridItemModal({
  isOpen,
  onClose,
  onSave,
  subsetGroupId,
}: AddGridItemModalProps) {
  const {
    // Form State & Data
    title,
    subsets,
    metrics,
    dimensions,
    dimensionFilters,
    // Selections
    selectedSubsetDetailId,
    selectedMetric,
    selectedDimension,
    selectedDimensionFilter,
    // Setters
    setTitle,
    setSelectedSubsetDetailId,
    setSelectedMetric,
    setSelectedDimension,
    setSelectedDimensionFilter,
    // UI State
    isLoading,
    error,
    resetAllState,
  } = useOverviewForm(subsetGroupId, isOpen)

  function handleClose() {
    resetAllState()
    onClose()
  }

  function handleSaveChanges() {
    const newItemConfig = {
      title,
      subsetId: selectedSubsetDetailId,
      dimensionField: selectedDimension,
      measureFieldDimension: selectedDimensionFilter,
      measureField: [{ value: selectedMetric, label: '', unit: '', show_label: false }],
    }
    onSave(newItemConfig)
    handleClose()
  }

  const isSaveDisabled =
    !title ||
    !selectedSubsetDetailId ||
    !selectedMetric ||
    !selectedDimension ||
    !selectedDimensionFilter ||
    Object.values(isLoading).some(Boolean)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title='Add New Grid Item'
    >
      <div className='space-y-4'>
        {error && <div className='rounded-md bg-red-100 p-3 text-red-500'>{error}</div>}
        <Input
          label='Title for the new item'
          value={title}
          setValue={setTitle}
          placeholder='e.g., Arrears (0-3 Months)'
        />

        <SelectField
          label='Data Subset'
          value={selectedSubsetDetailId}
          onChange={(e: any) => setSelectedSubsetDetailId(Number(e.target.value))}
          loading={isLoading.subsets}
          disabled={isLoading.subsets}
        >
          {subsets.map((s) => (
            <option
              key={s.id}
              value={s.subset_detail_id}
            >
              {s.name}
            </option>
          ))}
        </SelectField>

        <SelectField
          label='Dimension (Group By)'
          value={selectedDimension}
          onChange={(e: any) => setSelectedDimension(e.target.value)}
          loading={isLoading.details}
          disabled={!selectedSubsetDetailId || isLoading.details}
        >
          {dimensions.map((d) => (
            <option
              key={d.id}
              value={d.subset_column}
            >
              {d.subset_field_name}
            </option>
          ))}
        </SelectField>

        <SelectField
          label='Dimension Value (Filter)'
          value={selectedDimensionFilter}
          onChange={(e: any) => setSelectedDimensionFilter(e.target.value)}
          loading={isLoading.filters}
          disabled={!selectedDimension || isLoading.filters}
        >
          {dimensionFilters.map((df) => (
            <option
              key={df.name}
              value={df.name}
            >
              {df.name}
            </option>
          ))}
        </SelectField>

        <SelectField
          label='Metric (Value to Display)'
          value={selectedMetric}
          onChange={(e: any) => setSelectedMetric(e.target.value)}
          loading={isLoading.details}
          disabled={!selectedSubsetDetailId || isLoading.details}
        >
          {metrics.map((m) => (
            <option
              key={m.id}
              value={m.subset_column}
            >
              {m.subset_field_name}
            </option>
          ))}
        </SelectField>
      </div>
      <div className='mt-6 flex justify-end space-x-3 border-t pt-6'>
        <button
          type='button'
          onClick={handleClose}
          className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={handleSaveChanges}
          disabled={isSaveDisabled}
          className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300'
        >
          Save
        </button>
      </div>
    </Modal>
  )
}
