import React, { FormEvent, memo, useState, useEffect, ChangeEvent } from 'react'
import { useOverviewForm } from './hooks/useOverviewForm'
import {
  OverviewChart,
  SubsetGroupItem,
  SubsetMeasureField,
  SubsetDimensionField,
} from '@/interfaces/data_interfaces'
import Modal from '@/Components/Modal'
import Input from '@/ui/form/Input'
import InputLabel from '@/Components/InputLabel'
import Checkbox from '@/Components/Checkbox'
import SelectList from '@/ui/form/SelectList'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'

interface AddChartModalProps {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  subsetGroupId: number
  onSave: (newChart: OverviewChart) => void
  chartToEdit?: OverviewChart | null // Optional prop for editing
}

const colorSchemeOptions = Object.keys(chartPallet).map((key) => ({
  id: key,
  name: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
  colors: chartPallet[key as keyof typeof chartPallet],
}))

function AddChartModal({ isModalOpen, setIsModalOpen, subsetGroupId, onSave, chartToEdit }: AddChartModalProps) {
  const form = useOverviewForm(subsetGroupId, isModalOpen)
  const [chartType, setChartType] = useState('bar')
  const [selectedDimension, setSelectedDimension] = useState('')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [selectedColorScheme, setSelectedColorScheme] = useState(colorSchemeOptions[0]?.id || 'boldWarm')
  const [itemCount, setItemCount] = useState<number | ''>('')

  const isEditing = !!chartToEdit

  // Find the full color scheme object to get the array of colors for the preview
  const currentColorSchemeObject = colorSchemeOptions.find(
    (scheme) => scheme.id === selectedColorScheme
  )

  // Effect to populate form when editing, or reset when adding
  useEffect(() => {
    if (isModalOpen) {
      if (isEditing && chartToEdit) {
        // Populate form fields for editing
        form.setTitle(chartToEdit.title)
        form.setSelectedSubsetDetailId(Number(chartToEdit.subset_id))
        setChartType(chartToEdit.chart_type)
        setSelectedDimension(chartToEdit.x_axis)
        setSelectedMetrics(chartToEdit.y_axis)
        setSelectedColorScheme(chartToEdit.color_scheme || 'boldWarm')
        setItemCount(chartToEdit.item_count || '')
      } else {
        // Reset form for "Add New" mode
        resetLocalState()
        form.resetAllState()
      }
    }
  }, [isModalOpen, chartToEdit, isEditing])

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    const newChart: OverviewChart = {
      ...(isEditing ? chartToEdit : {}), // Preserve other potential properties if editing
      title: form.title,
      subset_id: String(form.selectedSubsetDetailId),
      chart_type: chartType,
      x_axis: selectedDimension,
      y_axis: selectedMetrics,
      color_scheme: selectedColorScheme,
      item_count: itemCount ? Number(itemCount) : undefined,
    }
    onSave(newChart)
    handleClose()
  }

  const resetLocalState = () => {
    setChartType('bar')
    setSelectedDimension('')
    setSelectedMetrics([])
    setSelectedColorScheme(colorSchemeOptions[0]?.id || 'boldWarm')
    setItemCount('')
  }

  const handleClose = () => {
    setIsModalOpen(false)
    resetLocalState()
    form.resetAllState()
  }

  const handleMetricCheckboxChange = (metricId: string, isChecked: boolean) => {
    setSelectedMetrics((prev) => {
      if (isChecked) {
        return [...prev, metricId]
      } else {
        return prev.filter((id) => id !== metricId)
      }
    })
  }

  const chartTypeOptions = [
    { id: 'bar', name: 'Bar' },
    { id: 'line', name: 'Line' },
    { id: 'pie', name: 'Pie' },
  ]

  const dimensionOptions = form.dimensions.map((d: SubsetDimensionField) => ({
    id: d.subset_column,
    name: d.subset_field_name,
  }))

  const metricOptions = form.metrics.map((m: SubsetMeasureField) => ({
    id: m.subset_column,
    name: m.subset_field_name,
  }))

  const isMultiMetric = chartType === 'bar' || chartType === 'line'
  const canSave = form.title && form.selectedSubsetDetailId && selectedDimension && selectedMetrics.length > 0

  return (
    <Modal show={isModalOpen} onClose={handleClose}>
      <form onSubmit={handleSave} className="p-6">
        <h2 className="text-lg font-medium text-gray-900">{isEditing ? 'Edit Chart' : 'Add New Chart'}</h2>
        <div className="mt-6 space-y-4">
          <Input label="Title" value={form.title} setValue={form.setTitle} required />
          <SelectList
            label="Subset"
            list={form.subsets.map((s: SubsetGroupItem) => ({ id: s.subset_detail_id, name: s.name }))}
            dataKey="id"
            displayKey="name"
            value={form.selectedSubsetDetailId}
            setValue={(value: string | number) => form.setSelectedSubsetDetailId(Number(value))}
            disabled={isEditing} // Prevent changing subset when editing to avoid data mismatches
          />
          <SelectList label="Chart Type" list={chartTypeOptions} dataKey="id" displayKey="name" value={chartType} setValue={setChartType} />
          <SelectList
            label="X-Axis (Dimension)"
            list={dimensionOptions}
            dataKey="id"
            displayKey="name"
            value={selectedDimension}
            setValue={setSelectedDimension}
            disabled={!form.selectedSubsetDetailId}
          />

          <div>
            {isMultiMetric ? (
              <div>
                <InputLabel>Y-Axis (Metrics)</InputLabel>
                <div className="mt-1 space-y-2 rounded-md border p-3 max-h-40 overflow-y-auto">
                  {metricOptions.map((metric) => (
                    <div key={metric.id} className="flex items-center">
                      <Checkbox id={`metric-${metric.id}`} checked={selectedMetrics.includes(metric.id)} onChange={(e: ChangeEvent<HTMLInputElement>) => handleMetricCheckboxChange(metric.id, e.target.checked)} disabled={!form.selectedSubsetDetailId} />
                      <InputLabel htmlFor={`metric-${metric.id}`} className="ml-2 font-normal text-gray-700">
                        {metric.name}
                      </InputLabel>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <SelectList label="Y-Axis (Metric)" list={metricOptions} dataKey="id" displayKey="name" value={selectedMetrics[0] || ''} setValue={(value: string) => setSelectedMetrics(value ? [value] : [])} disabled={!form.selectedSubsetDetailId} />
            )}
          </div>

          <div>
            <SelectList label="Color Scheme" list={colorSchemeOptions.map(({ id, name }) => ({ id, name }))} dataKey="id" displayKey="name" value={selectedColorScheme} setValue={setSelectedColorScheme} />
            {currentColorSchemeObject && (
              <div className="mt-2 flex items-center space-x-2 pl-1">
                {currentColorSchemeObject.colors.map((color) => (
                  <div key={color} className="h-5 w-5 rounded-full border border-gray-400 shadow-sm" style={{ backgroundColor: color }} title={color} />
                ))}
              </div>
            )}
          </div>

          <Input label="Number of Items to Show" type="number" value={itemCount} setValue={(val) => setItemCount(val === '' ? '' : Number(val))} placeholder="Leave blank to show all" min="1" />
        </div>

        <div className="mt-6 flex justify-end">
          <SecondaryButton type="button" onClick={handleClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" className="ml-3" disabled={!canSave}>
            {isEditing ? 'Save Changes' : 'Save'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  )
}

export default memo(AddChartModal)