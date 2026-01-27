import React, { useEffect, useMemo, useState } from 'react'
import Step from '@/Components/SetupDataTable/V2/Step'
import Step2QuerySelection from '@/Components/SetupDataTable/V2/Steps/Step2QuerySelection'
import Step3QueryPreview from '@/Components/SetupDataTable/V2/Steps/Step3QueryPreview'
import Step4QueryFieldConfig from '@/Components/SetupDataTable/V2/Steps/Step4QueryFieldConfig'
import Step1DataSource from '@/Components/SetupDataTable/V2/Steps/Step1DataShource'
import { DataLoaderAPI, DataLoaderQuery, ReferenceData } from '@/interfaces/data_interfaces'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import { DataTableFieldConfig } from '@/Components/SetupDataTable/ManageDataTableFields'
import { DataTableFieldMapping } from '@/Components/DataLoader/useDataTableToJsonMapping'
import Step5DataTableDetail from '@/Components/SetupDataTable/V2/Steps/Step5DataTableDetail'
import { FieldErrors } from '@/Components/SetupDataTable/SetupDataTable'
import Step2APISelection from '@/Components/SetupDataTable/V2/Steps/Step2APISelection'
import Step3APIPreview from '@/Components/SetupDataTable/V2/Steps/Step3APIPreview'

type DataSourceType = 'sql' | 'api' | 'excel' | null

interface Props {
  types: ReferenceData[]
  source: string
}

function SetupDataTableV2({ types, source }: Readonly<Props>) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [dataSource, setDataSource] = useState<DataSourceType>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [fields, setFields] = useState<DataTableFieldConfig[]>([])

  const [selectedQuery, setSelectedQuery] = useState<DataLoaderQuery | null>(null)
  const [selectedAPI, setSelectedAPI] = useState<DataLoaderAPI | null>(null)

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    if (source === 'sql') {
      setDataSource('sql')
      setCurrentStep(2)
    } else if (source === 'api') {
      setDataSource('api')
      setCurrentStep(2)
    }
  }, [source])

  const [sourceResponseStructure, setSourceResponseStructure] =
    useState<JSONStructureDefinition | null>(null)

  const steps = [
    { number: 1, label: 'Data Source' },
    { number: 2, label: 'Query Selection' },
    { number: 3, label: 'Data Preview' },
    { number: 4, label: 'Field Configuration' },
    { number: 5, label: 'Data Table Details & Job Schedule' },
  ]

  const handleDataSourceSelect = (source: DataSourceType) => {
    setDataSource(source)
    setCurrentStep(2)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 2) {
        setDataSource(null)
      }
      setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4 | 5)
    }
  }

  const handleContinue = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4 | 5)
    }
  }

  const handleStepClick = (step: number) => {
    if (selectedAPI == null && selectedQuery == null) {
      return
    }
    setCurrentStep(step)
  }

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

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='mb-1 text-3xl font-bold text-gray-900'>Data Connection</h1>
          <p className='text-sm text-gray-500'>Configure your data source and table structure</p>
        </div>

        {/* Progress Steps */}
        <div className='mb-10'>
          <div className='flex items-start justify-between'>
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <button onClick={() => handleStepClick(step.number)}>
                  <Step
                    number={step.number}
                    label={step.label}
                    isActive={step.number === currentStep}
                    isCompleted={step.number < currentStep}
                  />
                </button>
                {index < steps.length - 1 && <div className='mx-2 mt-6 h-px flex-1 bg-gray-300' />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {currentStep === 1 && <Step1DataSource onDataSourceSelect={handleDataSourceSelect} />}

        {currentStep === 2 && dataSource === 'sql' && (
          <Step2QuerySelection
            selectedQuery={selectedQuery}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onQuerySelect={setSelectedQuery}
            onBack={handleBack}
            onContinue={handleContinue}
          />
        )}

        {currentStep === 2 && dataSource === 'api' && (
          <Step2APISelection
            selectedAPI={selectedAPI}
            setSelectedAPI={setSelectedAPI}
            setSourceResponseStructure={setSourceResponseStructure}
            onBack={handleBack}
            onContinue={handleContinue}
          />
        )}

        {/*{currentStep === 2 && dataSource === 'excel' && (*/}
        {/*  <Step2ExcelSelection*/}
        {/*    searchQuery={searchQuery}*/}
        {/*    onSearchChange={setSearchQuery}*/}
        {/*    onBack={handleBack}*/}
        {/*    onContinue={handleContinue}*/}
        {/*  />*/}
        {/*)}*/}

        {currentStep === 3 && dataSource === 'sql' && (
          <Step3QueryPreview
            selectedQuery={selectedQuery}
            setSourceResponseStructure={setSourceResponseStructure}
            onBack={handleBack}
            onContinue={handleContinue}
          />
        )}

        {currentStep === 3 && dataSource === 'api' && (
          <Step3APIPreview
            selectedAPI={selectedAPI}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        )}

        {/*{currentStep === 3 && dataSource === 'excel' && (*/}
        {/*  <Step3ExcelPreview*/}
        {/*    onBack={handleBack}*/}
        {/*    onContinue={handleContinue}*/}
        {/*  />*/}
        {/*)}*/}

        {currentStep === 4 && (dataSource === 'sql' || dataSource === 'api') && (
          <Step4QueryFieldConfig
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onBack={handleBack}
            onContinue={handleContinue}
            responseStructure={sourceResponseStructure}
            fields={fields}
            setFields={setFields}
          />
        )}

        {currentStep === 5 && (
          <Step5DataTableDetail
            fields={fields}
            types={types}
            fieldMapping={fieldMapping}
            selectedQuery={selectedQuery}
            selectedAPI={selectedAPI}
            onErrorsChange={setFieldErrors}
          />
        )}

        {/*{currentStep === 4 && dataSource === 'api' && (*/}
        {/*  <Step4APIFieldConfig*/}
        {/*    searchQuery={searchQuery}*/}
        {/*    onSearchChange={setSearchQuery}*/}
        {/*    onBack={handleBack}*/}
        {/*    onContinue={handleContinue}*/}
        {/*  />*/}
        {/*)}*/}

        {/*{currentStep === 4 && dataSource === 'excel' && (*/}
        {/*  <Step4ExcelFieldConfig*/}
        {/*    searchQuery={searchQuery}*/}
        {/*    onSearchChange={setSearchQuery}*/}
        {/*    onBack={handleBack}*/}
        {/*    onContinue={handleContinue}*/}
        {/*  />*/}
        {/*)}*/}
      </div>
    </div>
  )
}

export default SetupDataTableV2
