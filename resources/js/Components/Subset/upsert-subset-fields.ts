import { showError } from '@/ui/alerts'
import { Dispatch, SetStateAction } from 'react'

export default function upsertSubsetFields<T extends { subset_column: string }>(
  selectedField: T | null,
  changedValue: T,
  setAddedDateFields: Dispatch<SetStateAction<T[]>>
): void {
  // update existing field
  if (selectedField != null) {
    setAddedDateFields((oldValues) => {
      //Check if updated subset_column is being used by other fields
      if (
        changedValue.subset_column != selectedField.subset_column &&
        oldValues.some((field) => field.subset_column === changedValue.subset_column)
      ) {
        showError('Date field already exists. Please choose another name for field.')
        return oldValues
      }
      return oldValues.map((field) => {
        //replace field having the same subset_column
        if (field.subset_column === selectedField.subset_column) {
          return { ...changedValue }
        }
        return field
      })
    })
    return
  }
  //insert new record
  setAddedDateFields((oldValues) => {
    //check if field already exists
    if (oldValues.some((field) => field.subset_column === changedValue.subset_column)) {
      showError('Date field already exists. Please choose another name for field.')
      return oldValues
    }
    //if not already existing insert at end
    return [...oldValues, changedValue]
  })
}
