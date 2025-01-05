import React, { SetStateAction, useMemo } from 'react'
import { SubsetDetail, SubsetMeasureField } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'

interface Props {
  subset: SubsetDetail
  selectedSortField: SubsetMeasureField | null
  secondarySortField: string
  setSecondarySortField: React.Dispatch<SetStateAction<string>>
  secondarySortOrder: string
  setSecondarySortOrder: React.Dispatch<React.SetStateAction<string>>
  showSecondarySortField: boolean
  setShowSecondarySortField: React.Dispatch<React.SetStateAction<boolean>>
}

const sortOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
]

export default function SecondarySort({
  subset,
  selectedSortField,
  secondarySortField,
  setSecondarySortField,
  secondarySortOrder,
  setSecondarySortOrder,
  showSecondarySortField,
  setShowSecondarySortField,
}: Readonly<Props>) {
  const secondarySortOptions = useMemo(() => {
    return (subset.measures ?? []).filter(
      (measure) => measure.subset_column != selectedSortField?.subset_column
    ) as SubsetMeasureField[]
  }, [selectedSortField, subset])

  return (
    <div className='flex flex-col gap-5'>
      {secondarySortOptions.length > 0 && (
        <div className='flex'>
          <button
            className='link text-sm'
            onClick={() => setShowSecondarySortField(true)}
          >
            Add Secondary Sort
          </button>
        </div>
      )}
      {showSecondarySortField && (
        <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4'>
          <div className='flex flex-col'>
            <SelectList
              list={secondarySortOptions}
              dataKey='subset_column'
              displayKey='subset_field_name'
              setValue={setSecondarySortField}
              value={secondarySortField}
              showAllOption
              allOptionText='None'
            />
          </div>
          <div className='flex flex-col'>
            <SelectList
              list={sortOptions}
              dataKey='value'
              displayKey='label'
              setValue={setSecondarySortOrder}
              value={secondarySortOrder}
            />
          </div>
        </div>
      )}
    </div>
  )
}
