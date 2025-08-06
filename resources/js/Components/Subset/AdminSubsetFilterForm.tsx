import {
  SubsetDateField,
  SubsetDetail,
  SubsetDimensionField,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import { FormEvent, useEffect, useRef, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'
import ComboBox from '@/ui/form/ComboBox'
import { XIcon } from 'lucide-react'
import { availableOperators } from '@/Components/DataExplorer/SubsetFilter/subsetFilterOperations'
import DatePicker from '@/ui/form/DatePicker'
import { OfficeData } from '@/Pages/DataExplorer/DataExplorerPage'
import { showError } from '@/ui/alerts'
import useAdminAvailableSubsetFilters from '@/Components/Subset/hooks/useAdminAvailableSubsetFilters'
import generateInitialFilterFields from '@/Components/Subset/hooks/generateInitialFilterFields'

interface Props {
  dates: SubsetDateField[]
  measures: SubsetMeasureField[]
  dimensions: SubsetDimensionField[]
  subset: SubsetDetail
  filters: Record<string, string | undefined | null>
  onSubmit: (querystring: string | null) => void
  offices?: OfficeData[]
}

export type SubsetFilterFormType = 'date' | 'dimension' | 'number' | 'office' | 'month' | 'string'

export interface SubsetFilterFormField {
  id: number
  field: string
  operator: string
  value: string
  dimensionData: { value: string } | null
  officeData: { office_name: string; office_code: string } | null
  type: SubsetFilterFormType
}

function isLastFieldFilled(fields: SubsetFilterFormField[]): boolean {
  if (fields.length === 0) {
    return true
  }
  const lastField = fields[fields.length - 1]
  if (lastField.field === '' || lastField.operator === '') {
    return false
  }
  if (lastField.type === 'dimension' && lastField.dimensionData == null) {
    return false
  }
  if (lastField.type === 'office' && lastField.officeData == null) {
    return false
  }
  if (lastField.type !== 'dimension' && lastField.type !== 'office' && lastField.value === '') {
    return false
  }
  return true
}

export default function AdminSubsetFilterForm({
  subset,
  dates,
  measures,
  dimensions,
  filters,
  offices,
  onSubmit,
}: Readonly<Props>) {
  const uuidRef = useRef(1)
  const [formFields, setFormFields] = useState<SubsetFilterFormField[]>(
    generateInitialFilterFields(filters, dates, measures, dimensions, offices).map((formField) => {
      return {
        ...formField,
        id: uuidRef.current++,
      }
    })
  )

  //to add or remove new fields at end
  useEffect(() => {
    if (formFields.length === 0) {
      setFormFields([
        {
          id: uuidRef.current++,
          field: '',
          operator: '=',
          value: '',
          dimensionData: null,
          officeData: null,
          type: 'string',
        },
      ])
      return
    }
    //if last form field is filled, add a new form field
    if (isLastFieldFilled(formFields)) {
      setFormFields((prevFormFields) => {
        return [
          ...prevFormFields,
          {
            id: uuidRef.current++,
            field: '',
            operator: '=',
            value: '',
            officeData: null,
            dimensionData: null,
            type: 'string',
          },
        ]
      })
      return
    }
    //if last two form fields are empty, remove the last form field
    if (
      formFields.length > 1 &&
      formFields[formFields.length - 1].field === '' &&
      formFields[formFields.length - 1].operator === '' &&
      formFields[formFields.length - 1].value === '' &&
      formFields[formFields.length - 1].dimensionData == null &&
      formFields[formFields.length - 1].officeData == null &&
      formFields[formFields.length - 2].field === '' &&
      formFields[formFields.length - 2].operator === '' &&
      formFields[formFields.length - 2].value === '' &&
      formFields[formFields.length - 2].dimensionData == null &&
      formFields[formFields.length - 2].officeData == null
    ) {
      setFormFields((prevFormFields) => {
        return prevFormFields.slice(0, prevFormFields.length - 1)
      })
    }
  }, [formFields])

  const availableFields = useAdminAvailableSubsetFilters(dates, dimensions, measures)

  const setField = (id: number, value: string) => {
    const field = availableFields.find((field) => field.column === value)
    setFormFields((prevFormFields) => {
      return prevFormFields.map((formField) => {
        if (formField.id === id) {
          return {
            ...formField,
            field: value,
            type: (field?.type ?? 'string') as SubsetFilterFormType,
            operator: '=',
            value: '',
            officeData: null,
            dimensionData: null,
          }
        }
        return formField
      })
    })
  }

  const setOperator = (id: number, value: string) => {
    setFormFields((prevFormFields) => {
      return prevFormFields.map((formField) => {
        if (formField.id === id) {
          return {
            ...formField,
            operator: value,
            value: '',
            officeData: null,
            dimensionData: null,
          }
        }
        return formField
      })
    })
  }

  const setValue = (id: number, value: string) => {
    setFormFields((prevFormFields) => {
      return prevFormFields.map((formField) => {
        if (formField.id === id) {
          return {
            ...formField,
            value: value,
            officeData: null,
            dimensionData: null,
          }
        }
        return formField
      })
    })
  }

  const formSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const urlParams = new URLSearchParams()
    let errorFlag = false
    //For grouping multiple =, != data into _in, not_ins
    const groupedData: {
      field: string
      operator: '=' | '_not'
      value: string[]
    }[] = []
    formFields.forEach((formField) => {
      if (formField.field == '' || formField.operator == '') {
        return
      }
      let searchValue = formField.value
      if (formField.type === 'dimension') {
        searchValue = formField.dimensionData?.value ?? ''
      }
      if (formField.type === 'office') {
        searchValue = formField.officeData?.office_code ?? ''
      }
      if (searchValue === '') {
        errorFlag = true
        showError('Please fill in the value for or remove: ' + formField.field)
        return
      }
      if (
        (formField.operator === '=' || formField.operator === '_not') &&
        (formField.type == 'dimension' || formField.type == 'string' || formField.type == 'date')
      ) {
        const existingGroup = groupedData.find(
          (group) => group.field === formField.field && group.operator === formField.operator
        )
        if (existingGroup != null) {
          existingGroup.value.push(searchValue)
        } else {
          groupedData.push({
            field: formField.field,
            operator: formField.operator,
            value: [searchValue],
          })
        }
        return
      }
      urlParams.set(
        `${formField.field}${formField.operator == '=' ? '' : formField.operator}`,
        searchValue
      )
    })
    if (errorFlag) {
      return
    }
    groupedData.forEach((group) => {
      if (group.value.length == 1) {
        urlParams.set(
          `${group.field}${group.operator == '=' ? '' : group.operator}`,
          group.value[0]
        )
      }
      if (group.value.length > 1) {
        urlParams.set(
          `${group.field}${group.operator == '=' ? '_in' : '_not_in'}`,
          group.value.join(',')
        )
      }
    })
    onSubmit(urlParams.toString())
  }

  const removeField = (id: number) => {
    setFormFields((prevFormFields) => {
      return prevFormFields.filter((formField) => formField.id !== id)
    })
  }

  //Autocomplete selection for dimension values
  const setDimensionFieldValue = (id: number, value: { value: string } | null) => {
    setFormFields((prevFormFields) => {
      return prevFormFields.map((formField) => {
        if (formField.id === id) {
          return {
            ...formField,
            value: '',
            officeData: null,
            dimensionData: value,
          }
        }
        return formField
      })
    })
  }

  const setOfficeFieldValue = (
    id: number,
    value: { office_code: string; office_name: string } | null
  ) => {
    setFormFields((prevFormFields) => {
      return prevFormFields.map((formField) => {
        if (formField.id === id) {
          return {
            ...formField,
            value: '',
            officeData: value,
            dimensionData: null,
          }
        }
        return formField
      })
    })
  }

  return (
    <form
      className='flex flex-col gap-5 py-5'
      onSubmit={formSubmit}
    >
      {formFields.map((formField) => (
        <div
          className={`grid grid-cols-3 gap-2`}
          key={formField.id}
        >
          <div className='flex flex-col'>
            <SelectList
              label='Field'
              list={availableFields}
              dataKey='column'
              displayKey='fieldName'
              setValue={(value) => setField(formField.id, value)}
              value={formField.field}
              showAllOption
              allOptionText='Select Field'
            />
          </div>
          <div className='flex flex-col'>
            <SelectList
              label='Operator'
              list={availableOperators(formField.type ?? '')}
              dataKey='value'
              displayKey='operation'
              setValue={(value) => setOperator(formField.id, value)}
              value={formField.operator}
              showAllOption
              allOptionText='Select Operator'
            />
          </div>
          <div className='flex items-end justify-between'>
            <div className='flex-grow-1 flex-shrink-1 flex w-full flex-col'>
              {(formField.type == 'string' || formField.type == 'number') && (
                <Input
                  label='Value'
                  setValue={(value) => setValue(formField.id, value)}
                  value={formField.value}
                />
              )}
              {formField.type == 'date' && (
                <DatePicker
                  setValue={(value) => setValue(formField.id, value)}
                  value={formField.value}
                  label='Date'
                />
              )}
              {formField.type == 'office' && (
                <ComboBox
                  label='Office'
                  placeholder='Search By Office Name'
                  value={formField.officeData}
                  dataKey='office_code'
                  displayKey='office_name'
                  displayValue2='office_code'
                  setValue={(value) => setOfficeFieldValue(formField.id, value)}
                  url={route('office-search', {
                    search: '',
                  })}
                />
              )}
              {formField.type == 'dimension' && (
                <ComboBox
                  label={`${formField.field}`}
                  placeholder={`Search For ${formField.field} Options`}
                  value={formField.dimensionData}
                  dataKey='value'
                  displayKey='value'
                  setValue={(value) => setDimensionFieldValue(formField.id, value)}
                  url={route('subset.column.search', {
                    subsetDetail: subset.id,
                    column: formField.field,
                    search: '',
                  })}
                />
              )}
            </div>
            <button
              className='mb-2 cursor-pointer rounded-full p-1 hover:bg-gray-50'
              onClick={() => removeField(formField.id)}
            >
              <XIcon />
            </button>
          </div>
        </div>
      ))}
      <div className='flex gap-2'>
        <Button label='Search' />
        <Button
          type={'button'}
          label='Reset'
          onClick={() => onSubmit(null)}
        />
      </div>
    </form>
  )
}
