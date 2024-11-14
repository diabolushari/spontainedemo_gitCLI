import { SubsetDateField, SubsetDetail, SubsetMeasureField } from '@/interfaces/data_interfaces'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'

interface Props {
  dates: SubsetDateField[]
  measures: SubsetMeasureField[]
  dimensions: SubsetDateField[]
  subset: SubsetDetail
  filters: Record<string, string | undefined | null>
  onSubmit: (querystring: string | null) => void
}

interface FormField {
  id: number
  field: string
  operator: string
  value: string
  type: string
}

const dateOperators = [
  { operation: 'equals', value: '=' },
  { operation: 'not equals', value: '_not' },
  { operation: 'from', value: '_from' },
  { operation: 'to', value: '_to' },
  { operation: 'in list', value: '_in' },
  { operation: 'not in list', value: '_not_in' },
]

const dimensionOperators = [
  { operation: 'equals', value: '=' },
  { operation: 'not equals', value: '_not' },
  { operation: 'contains', value: '_like' },
  { operation: 'not containing', value: '_not_like' },
  { operation: 'in list', value: '_in' },
  { operation: 'not in list', value: '_not_in' },
]

const measureOperators = [
  { operation: 'equals', value: '=' },
  { operation: 'not equals', value: '_not' },
  { operation: 'greater than', value: '_greater_than' },
  { operation: 'less than', value: '_less_than' },
  { operation: 'in list', value: '_in' },
  { operation: 'not in list', value: '_not_in' },
]

const availableOperators = (type: string) => {
  switch (type) {
    case 'date':
      return dateOperators
    case 'dimension':
      return dimensionOperators
    case 'number':
      return measureOperators
    default:
      return []
  }
}

const generateInitialFields = (
  filters: Record<string, string | undefined | null>,
  dates: SubsetDateField[],
  measures: SubsetMeasureField[],
  dimensions: SubsetDateField[]
) => {
  const fields: FormField[] = []

  Object.keys(filters).forEach((key) => {
    dates.forEach((date) => {
      if (date.info == null) {
        return
      }
      if (key === date.info.column) {
        fields.push({
          id: 0,
          field: date.info.column ?? '',
          operator: '=',
          value: filters[key] ?? '',
          type: 'date',
        })
      }
      if (key === `${date.info.column}_not`) {
        fields.push({
          id: 0,
          field: date.info.column ?? '',
          operator: '_not',
          value: filters[key] ?? '',
          type: 'date',
        })
      }
      if (key === `${date.info.column}_from`) {
        fields.push({
          id: 0,
          field: date.info.column ?? '',
          operator: '_from',
          value: filters[key] ?? '',
          type: 'date',
        })
      }
      if (key === `${date.info.column}_to`) {
        fields.push({
          id: 0,
          field: date.info.column ?? '',
          operator: '_to',
          value: filters[key] ?? '',
          type: 'date',
        })
      }
      if (key === `${date.info.column}_in`) {
        fields.push({
          id: 0,
          field: date.info.column ?? '',
          operator: '_in',
          value: filters[key] ?? '',
          type: 'date',
        })
      }
      if (key === `${date.info.column}_not_in`) {
        fields.push({
          id: 0,
          field: date.info.column ?? '',
          operator: '_not_in',
          value: filters[key] ?? '',
          type: 'date',
        })
      }
    })
    dimensions.forEach((dimension) => {
      if (dimension.info == null) {
        return
      }
      if (key === dimension.info.column) {
        fields.push({
          id: 0,
          field: dimension.info.column ?? '',
          operator: '=',
          value: filters[key] ?? '',
          type: 'dimension',
        })
      }
      if (key === `${dimension.info.column}_not`) {
        fields.push({
          id: 0,
          field: dimension.info.column ?? '',
          operator: '_not',
          value: filters[key] ?? '',
          type: 'dimension',
        })
      }
      if (key === `${dimension.info.column}_like`) {
        fields.push({
          id: 0,
          field: dimension.info.column ?? '',
          operator: '_like',
          value: filters[key] ?? '',
          type: 'dimension',
        })
      }
      if (key === `${dimension.info.column}_not_like`) {
        fields.push({
          id: 0,
          field: dimension.info.column ?? '',
          operator: '_not_like',
          value: filters[key] ?? '',
          type: 'dimension',
        })
      }
      if (key === `${dimension.info.column}_in`) {
        fields.push({
          id: 0,
          field: dimension.info.column ?? '',
          operator: '_in',
          value: filters[key] ?? '',
          type: 'dimension',
        })
      }
      if (key === `${dimension.info.column}_not_in`) {
        fields.push({
          id: 0,
          field: dimension.info.column ?? '',
          operator: '_not_in',
          value: filters[key] ?? '',
          type: 'dimension',
        })
      }
    })
    measures.forEach((measure) => {
      if (measure.info == null) {
        return
      }
      if (key === measure.info.column) {
        fields.push({
          id: 0,
          field: measure.info.column ?? '',
          operator: '=',
          value: filters[key] ?? '',
          type: 'number',
        })
      }
      if (key === `${measure.info.column}_not`) {
        fields.push({
          id: 0,
          field: measure.info.column ?? '',
          operator: '_not',
          value: filters[key] ?? '',
          type: 'number',
        })
      }
      if (key === `${measure.info.column}_greater_than`) {
        fields.push({
          id: 0,
          field: measure.info.column ?? '',
          operator: '_greater_than',
          value: filters[key] ?? '',
          type: 'number',
        })
      }
      if (key === `${measure.info.column}_less_than`) {
        fields.push({
          id: 0,
          field: measure.info.column ?? '',
          operator: '_less_than',
          value: filters[key] ?? '',
          type: 'number',
        })
      }
      if (key === `${measure.info.column}_in`) {
        fields.push({
          id: 0,
          field: measure.info.column ?? '',
          operator: '_in',
          value: filters[key] ?? '',
          type: 'number',
        })
      }
      if (key === `${measure.info.column}_not_in`) {
        fields.push({
          id: 0,
          field: key,
          operator: '_not_in',
          value: filters[key] ?? '',
          type: 'number',
        })
      }
    })
  })

  return fields
}

export default function SubsetFilterForm({
  dates,
  measures,
  dimensions,
  subset,
  filters,
  onSubmit,
}: Readonly<Props>) {
  const uuidRef = useRef(1)
  const [formFields, setFormFields] = useState<FormField[]>(
    generateInitialFields(filters, dates, measures, dimensions).map((formField) => {
      return {
        ...formField,
        id: uuidRef.current++,
      }
    })
  )

  useEffect(() => {
    if (formFields.length === 0) {
      setFormFields([
        {
          id: uuidRef.current++,
          field: '',
          operator: '',
          value: '',
          type: '',
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
            operator: '',
            value: '',
            type: '',
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
      formFields[formFields.length - 2].field === '' &&
      formFields[formFields.length - 2].operator === '' &&
      formFields[formFields.length - 2].value === ''
    ) {
      setFormFields((prevFormFields) => {
        return prevFormFields.slice(0, prevFormFields.length - 1)
      })
    }
  }, [formFields])

  const availableFields = useMemo(() => {
    const fields: {
      fieldId: number
      fieldName: string
      column: string
      type: string
    }[] = []

    dates.forEach((date) => {
      if (date.info == null) {
        return
      }
      fields.push({
        fieldId: date.field_id,
        fieldName: date.subset_field_name ?? '',
        column: date.info.column ?? '',
        type: 'date',
      })
    })

    dimensions.forEach((dimension) => {
      if (dimension.info == null) {
        return
      }
      fields.push({
        fieldId: dimension.field_id,
        fieldName: dimension.subset_field_name ?? '',
        column: dimension.info.column ?? '',
        type: 'dimension',
      })
    })

    measures.forEach((measure) => {
      if (measure.info == null) {
        return
      }
      fields.push({
        fieldId: measure.field_id,
        fieldName: measure.subset_field_name ?? '',
        column: measure.info.column ?? '',
        type: 'number',
      })
    })

    return fields
  }, [dates, measures, dimensions])

  const setField = (id: number, value: string) => {
    const field = availableFields.find((field) => field.column === value)
    setFormFields((prevFormFields) => {
      return prevFormFields.map((formField) => {
        if (formField.id === id) {
          return {
            ...formField,
            field: value,
            type: field?.type ?? '',
            operator: '',
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
      if (formField.field == '' || formField.operator == '' || formField.value == '') {
        return
      }
      urlParams.set(
        `${formField.field}${formField.operator == '=' ? '' : formField.operator}`,
        formField.value
      )
    })
    onSubmit(urlParams.toString())
  }

  return (
    <form
      className='flex flex-col gap-5 py-5'
      onSubmit={formSubmit}
    >
      {formFields.map((formField) => (
        <div
          className='grid grid-cols-3 gap-2'
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
          <div className='flex flex-col'>
            <Input
              label='Value'
              setValue={(value) => setValue(formField.id, value)}
              value={formField.value}
            />
          </div>
        </div>
      ))}
      <div className='flex'>
        <Button label='Search' />
      </div>
    </form>
  )
}
