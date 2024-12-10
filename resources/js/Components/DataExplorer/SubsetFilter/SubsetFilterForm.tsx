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
import generateInitialFields from '@/Components/DataExplorer/SubsetFilter/generateInitialFields'
import ComboBox from '@/ui/form/ComboBox'
import { XIcon } from 'lucide-react'
import { availableOperators } from '@/Components/DataExplorer/SubsetFilter/subsetFilterOperations'
import useAvailableSubsetFilters from '@/Components/DataExplorer/SubsetFilter/useAvailableSubsetFilters'
import DatePicker from '@/ui/form/DatePicker'

interface Props {
  dates: SubsetDateField[]
  measures: SubsetMeasureField[]
  dimensions: SubsetDimensionField[]
  subset: SubsetDetail
  filters: Record<string, string | undefined | null>
  onSubmit: (querystring: string | null) => void
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

export default function SubsetFilterForm({
  subset,
  dates,
  measures,
  dimensions,
  filters,
  onSubmit,
}: Readonly<Props>) {
  const uuidRef = useRef(1)
  const [formFields, setFormFields] = useState<SubsetFilterFormField[]>(
    generateInitialFields(filters, dates, measures, dimensions).map((formField) => {
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
    if (
      formFields[formFields.length - 1].field !== '' &&
      formFields[formFields.length - 1].operator !== '' &&
      formFields[formFields.length - 1].value !== ''
    ) {
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

  const availableFields = useAvailableSubsetFilters(dates, dimensions, measures)

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
        return
      }
      urlParams.set(
        `${formField.field}${formField.operator == '=' ? '' : formField.operator}`,
        searchValue
      )
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
          className={`grid ${formField.type === 'dimension' || formField.type === 'office' ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}
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
          {!(formField.type === 'dimension' || formField.type === 'office') && (
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
          )}
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
                  label='Value'
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
      <div className='flex'>
        <Button label='Search' />
      </div>
    </form>
  )
}
