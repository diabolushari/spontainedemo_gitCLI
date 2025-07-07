import { X } from 'lucide-react'
import { memo } from 'react'

import Modal from '@/Components/Modal'
import Input from '@/ui/form/Input'
import InputLabel from '@/Components/InputLabel'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import DeleteButton from '@/ui/button/DeleteButton'
import Checkbox from '@/Components/Checkbox'
import SelectList from '@/ui/form/SelectList'

import useCustomForm from '@/hooks/useCustomForm' 

import {
    OverviewTable,
    Filter as BaseFilter,
    SubsetDetail,
    SubsetMeasureField,
} from '@/interfaces/data_interfaces'

interface FilterWithId extends BaseFilter {
    id: number
    value: string
}

type NewGridItem = OverviewTable & { id: number }

interface FormData {
    title: string
    subsetId: SubsetDetail['id'] | ''
    metricId: SubsetMeasureField['subset_column']
    filters: FilterWithId[]
    colSpan2: boolean
}

interface AddGridItemModalProps {
    isModalOpen: boolean
    setIsModalOpen: (isOpen: boolean) => void
    subsetGroupId: number
    onSave: (newItem: NewGridItem) => void
}

const operatorOptions = [
    { value: 'equals', name: 'Equals' },
    { value: 'not_equals', name: 'Not Equals' },
    { value: 'greater_than', name: 'Greater Than' },
    { value: 'less_than', name: 'Less Than' },
]

const initialFormData: FormData = {
    title: '',
    subsetId: '',
    metricId: '',
    filters: [],
    colSpan2: false,
}

function AddGridItemModal({
    isModalOpen,
    setIsModalOpen,
    subsetGroupId,
    onSave,
}: AddGridItemModalProps) {
    const { formData, setFormValue, setAll, toggleBoolean } = useCustomForm<FormData>(initialFormData)

    const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        if (field === 'subsetId') {
            setAll({
                subsetId: value,
                metricId: '',
                filters: [],
            })
        } else {
            setFormValue(field)(value)
        }
    }

    const addFilter = () => {
        const newFilter: FilterWithId = {
            id: Date.now(),
            dimension: '',
            operator: 'equals',
            value: '',
        }
        setAll({ filters: [...formData.filters, newFilter] })
    }

    const removeFilter = (id: number) => {
        const updatedFilters = formData.filters.filter((f) => f.id !== id)
        setAll({ filters: updatedFilters })
    }

    const updateFilter = (id: number, field: keyof BaseFilter, value: string) => {
        const updatedFilters = formData.filters.map((f) => {
            if (f.id !== id) return f

            const isDimensionChange = field === 'dimension' && f.dimension !== value
            return {
                ...f,
                [field]: value,
                ...(isDimensionChange && { value: '' }),
            }
        })
        setAll({ filters: updatedFilters })
    }

    const handleClose = () => {
        setIsModalOpen(false)
        setAll(initialFormData)
    }

    const handleSave = (e: FormEvent) => {
        e.preventDefault()
        const newItem: NewGridItem = {
            id: Date.now(),
            title: formData.title,
            subset_id: String(formData.subsetId),
            measure_field: [formData.metricId],
            show_total: false,
            grid_number: null,
            filters: formData.filters.map(({ id, ...rest }) => rest),
            col_span_2: formData.colSpan2,
        }
        onSave(newItem)
        handleClose()
    }


    const renderFilterRow = (filter: FilterWithId) => (
        <div key={filter.id} className="grid grid-cols-12 gap-x-2 items-end">
            <div className="col-span-4">
                <DynamicSelectList
                    label="Dimension"
                    key={`dim-${formData.subsetId}`}
                    url={`/api/subset/dimension/${formData.subsetId}`}
                    dataKey="subset_column"
                    displayKey="subset_field_name"
                    value={filter.dimension}
                    setValue={(value: string) => updateFilter(filter.id, 'dimension', value)}
                    disabled={!formData.subsetId}
                />
            </div>
            <div className="col-span-3">
                <SelectList
                    label="Operator"
                    list={operatorOptions}
                    dataKey="value"
                    displayKey="name"
                    value={filter.operator}
                    setValue={(value: string) => updateFilter(filter.id, 'operator', value)}
                />
            </div>
            <div className="col-span-4">
                <DynamicSelectList
                    label="Value"
                    key={`val-${filter.dimension}`}
                    url={`/api/subset/dimension/fields/${filter.dimension}/${formData.subsetId}`}
                    dataKey="name"
                    displayKey="name"
                    value={filter.value}
                    setValue={(value: string) => updateFilter(filter.id, 'value', value)}
                    disabled={!filter.dimension}
                />
            </div>
            <div className="col-span-1">
                <DeleteButton onClick={() => removeFilter(filter.id)} />
            </div>
        </div>
    )

    return (
        <Modal show={isModalOpen} onClose={handleClose} maxWidth="2xl">
            <form onSubmit={handleSave} className="p-6">
                <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Add Grid Item</h2>
                    <button type="button" className="text-gray-400 hover:text-gray-500" onClick={handleClose}>
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                <div className="mt-6 space-y-6">
                    <Input
                        label="Title"
                        value={formData.title}
                        // Use the hook's setter factory directly for a cleaner call.
                        setValue={setFormValue('title')}
                        required
                        type="text"
                    />

                    <DynamicSelectList
                        label="Data Subset"
                        url={`/api/subset-group/${subsetGroupId}`}
                        dataKey="subset_detail_id"
                        displayKey="name"
                        value={formData.subsetId}
                        // Use our custom handler here because this change has side effects.
                        setValue={(value: number | string) => handleChange('subsetId', Number(value))}
                    />

                    <DynamicSelectList
                        label="Metric"
                        key={formData.subsetId}
                        url={`/api/subset/${formData.subsetId}`}
                        dataKey="subset_column"
                        displayKey="subset_field_name"
                        value={formData.metricId}
                        // Use the hook's setter factory for a simple value update.
                        setValue={setFormValue('metricId')}
                        disabled={!formData.subsetId}
                        required
                    />

                    <div>
                        <InputLabel>Filters</InputLabel>
                        <div className="mt-2 space-y-4">{formData.filters.map(renderFilterRow)}</div>
                        <SecondaryButton
                            type="button"
                            className="mt-4"
                            onClick={addFilter}
                            disabled={!formData.subsetId}
                        >
                            Add Filter
                        </SecondaryButton>
                    </div>

                    <div className="flex items-center">
                        <Checkbox
                            id="col_span_2"
                            name="col_span_2"
                            checked={formData.colSpan2}
                            onChange={toggleBoolean('colSpan2')}
                        />
                        <InputLabel htmlFor="col_span_2" className="ml-2">
                            2-column width
                        </InputLabel>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-2 pt-4 border-t">
                    <SecondaryButton type="button" onClick={handleClose}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton type="submit">Save</PrimaryButton>
                </div>
            </form>
        </Modal>
    )
}

export default memo(AddGridItemModal)