import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { DataLoaderAPI, DataLoaderQuery, ReferenceData } from '@/interfaces/data_interfaces'
import DataSourceSelection, { DataSource } from './DataSourceSelection'
import ManageDataTableFields, {
  DataTableFieldConfig,
} from '@/Components/SetupDataTable/ManageDataTableFields'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import SetupDataTableForm from './SetupDataTableForm'
import { DataTableFieldMapping } from '@/Components/DataLoader/useDataTableToJsonMapping'

interface Props {
  types: ReferenceData[]
}

export interface FieldErrors {
  [fieldColumn: string]: string[]
}

const SetupDataTable = ({ types }: Readonly<Props>) => {
  const [selectedSource, setSelectedSource] = useState<DataSource>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedAPI, setSelectedAPI] = useState<DataLoaderAPI | null>(null)
  const [selectedQuery, setSelectedQuery] = useState<DataLoaderQuery | null>(null)
  const [sourceResponseStructure, setSourceResponseStructure] =
    useState<JSONStructureDefinition | null>(null)
  const [fields, setFields] = useState<DataTableFieldConfig[]>([])
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    setFields([])
  }, [selectedAPI, selectedQuery])

  const sourceName = useMemo(() => {
    switch (selectedSource) {
      case 'api':
        return 'REST API'
      case 'sql':
        return 'SQL Query'
      case 'excel':
        return 'Excel File'
      default:
        return null
    }
  }, [selectedSource])

  const fieldMapping = useMemo(() => {
    return fields
      .filter((field) => field.source_field_path != null)
      .map((field) => {
        return {
          column: field.column,
          field_name: field.field_name,
          field_type: field.type as 'date' | 'dimension' | 'measure' | 'text' | 'relation',
          json_field_path: field.source_field_path,
          date_format:
            field.type === 'date' ? (field.source_field_date_format ?? 'Y-m-d') : undefined,
        } as DataTableFieldMapping
      })
  }, [fields])

  const handleSourceSelect = useCallback((source: Exclude<DataSource, null>) => {
    setSelectedSource(source)
    setSelectedAPI(null)
    setSelectedQuery(null)
    setSourceResponseStructure(null)
    setIsSheetOpen(true)
  }, [])

  const handleAPISelect = useCallback((api: DataLoaderAPI) => {
    setSelectedAPI(api)
    setSourceResponseStructure(api.response_structure ?? null)
    setIsSheetOpen(false)
  }, [])

  const handleQuerySelect = useCallback((query: DataLoaderQuery) => {
    setSelectedQuery(query)
    setIsSheetOpen(false)
  }, [])

  const handleClearSelection = useCallback(() => {
    setSelectedAPI(null)
    setSelectedQuery(null)
    setSourceResponseStructure(null)
    setSelectedSource(null)
  }, [])

  const handleChangeSelection = useCallback(() => {
    setSelectedAPI(null)
    setSelectedQuery(null)
    setSourceResponseStructure(null)
    setIsSheetOpen(true)
  }, [])

  return (
    <div className='flex flex-col gap-5'>
      <Card className='p-6'>
        <CardHeader title='Setup Data Table' />
        <div className='mt-6 px-4'>
          <h3 className='mb-4 text-lg font-semibold'>Step 1: Choose Data Source</h3>
          <p className='small-1stop mb-6 text-gray-600'>Select how you want to import your data</p>
          <DataSourceSelection
            selectedSource={selectedSource}
            selectedAPI={selectedAPI}
            selectedQuery={selectedQuery}
            isSheetOpen={isSheetOpen}
            sourceName={sourceName}
            onSourceSelect={handleSourceSelect}
            onSheetOpenChange={setIsSheetOpen}
            onAPISelect={handleAPISelect}
            onQuerySelect={handleQuerySelect}
            onChangeSelection={handleChangeSelection}
            onClearSelection={handleClearSelection}
            setSourceResponseStructure={setSourceResponseStructure}
          />
        </div>

        {(selectedAPI || selectedQuery) && (
          <>
            <div className='mt-8 px-4'>
              <h3 className='mb-4 text-lg font-semibold'>Step 2: Configure Data Table Fields</h3>
              <p className='small-1stop mb-6 text-gray-600'>
                Define the fields and their types for your data table
              </p>
              <ManageDataTableFields
                fields={fields}
                setFields={setFields}
                responseStructure={sourceResponseStructure}
                selectedAPI={selectedAPI}
                sourceName={sourceName}
                fieldErrors={fieldErrors}
              />
            </div>

            {fields.length > 0 && (
              <div className='mt-8 px-4'>
                <h3 className='mb-4 text-lg font-semibold'>
                  Step 3: Data Table Details & Job Schedule
                </h3>
                <p className='small-1stop mb-6 text-gray-600'>
                  Provide name, description, and configure the data loading job schedule
                </p>
                <SetupDataTableForm
                  fields={fields}
                  types={types}
                  selectedAPI={selectedAPI}
                  selectedQuery={selectedQuery}
                  fieldMapping={fieldMapping}
                  onErrorsChange={setFieldErrors}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

export default SetupDataTable
