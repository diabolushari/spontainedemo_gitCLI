import Checkbox from '@/Components/Checkbox'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { memo } from 'react'

interface Props {
  definition: JSONDefinition
  updateJsonFieldName: (fieldId: number, fieldName: string) => void
  updateJsonFieldType: (fieldId: number, fieldType: JSONFieldType) => void
  addNewFieldToJson: (parentId: number) => void
  removeFieldFromJson: (fieldId: number) => void
  setAsPrimaryField: (fieldId: number) => void
}

export type JSONFieldType = 'array' | 'object' | 'primitive' | 'primitive-array'

export interface JSONDefinition {
  id: number
  field_name: string
  field_type: JSONFieldType
  primary_field: boolean
  children: JSONDefinition[]
}

const fieldTypes = [
  { value: 'array', label: 'Array Of Objects' },
  { value: 'object', label: 'Object' },
  { value: 'primitive', label: 'Primitive' },
  { value: 'primitive-array', label: 'Array Of Primitives' },
]

const rootFieldTypes = [
  { value: 'array', label: 'Array Of Objects' },
  { value: 'object', label: 'Object' },
]

function SetDataStructure({
  definition,
  addNewFieldToJson,
  removeFieldFromJson,
  updateJsonFieldName,
  updateJsonFieldType,
  setAsPrimaryField,
}: Readonly<Props>) {
  return (
    <div className='flex flex-col rounded-xl'>
      <div className='flex items-end gap-2 bg-gray-200 p-2'>
        <div className='my-auto flex h-full flex-col self-center'>
          <Checkbox
            checked={definition.primary_field}
            onChange={() => setAsPrimaryField(definition.id)}
          />
        </div>
        <div className='grid w-full grid-cols-2 gap-1'>
          <div className='flex flex-col'>
            <Input
              setValue={(value) => updateJsonFieldName(definition.id, value)}
              value={definition.field_name}
              disabled={definition.field_name === 'response'}
              placeholder='Field Name'
            />
          </div>
          <div className='flex flex-col'>
            <SelectList
              setValue={(value) => updateJsonFieldType(definition.id, value as JSONFieldType)}
              value={definition.field_type}
              list={definition.field_name === 'response' ? rootFieldTypes : fieldTypes}
              dataKey='value'
              displayKey='label'
            />
          </div>
        </div>
        {definition.field_name !== 'response' && (
          <button
            className='flex-shrink-0 p-2 hover:bg-1stop-accent2'
            type='button'
            onClick={() => removeFieldFromJson(definition.id)}
          >
            <i className='la la-close' />
          </button>
        )}
      </div>
      <div className='flex flex-col pl-5'>
        <div className=''>
          {definition.field_type === 'array' && (
            <span>
              {definition.children.length} fields in every object of {definition.field_name} array
            </span>
          )}
          {definition.field_type === 'object' && (
            <span>
              {definition.children.length} fields in {definition.field_name} object
            </span>
          )}
        </div>
        <div className='flex flex-col'>
          {definition.children.map((child) => (
            <SetDataStructure
              definition={child}
              key={child.id}
              addNewFieldToJson={addNewFieldToJson}
              removeFieldFromJson={removeFieldFromJson}
              updateJsonFieldName={updateJsonFieldName}
              updateJsonFieldType={updateJsonFieldType}
              setAsPrimaryField={setAsPrimaryField}
            />
          ))}
          {definition.field_type !== 'primitive' && definition.field_type !== 'primitive-array' && (
            <div className='flex'>
              <button
                className='link'
                type='button'
                onClick={() => addNewFieldToJson(definition.id)}
              >
                Add Field To {definition.field_name}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(SetDataStructure)
