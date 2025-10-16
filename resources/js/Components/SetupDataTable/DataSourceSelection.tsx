import React, { useMemo } from 'react'
import { FiCheck, FiDatabase, FiFileText, FiGrid, FiX } from 'react-icons/fi'
import { cn } from '@/utils'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from '@/Components/ui/sheet'
import LoaderAPIPicker from './LoaderAPIPicker'
import LoaderQueryPicker from './LoaderQueryPicker'
import { DataLoaderAPI, DataLoaderQuery } from '@/interfaces/data_interfaces'
import JsonDataViewer from '@/Components/DataLoader/DataSourcePreview/JsonDataViewer'
import QueryDataViewer from '@/Components/DataLoader/DataSourcePreview/QueryDataViewer'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'

export type DataSource = 'sql' | 'api' | 'excel' | null

interface DataSourceOption {
  type: Exclude<DataSource, null>
  title: string
  description: string
  icon: React.ReactNode
}

const dataSourceOptions: DataSourceOption[] = [
  {
    type: 'sql',
    title: 'SQL Query',
    description: 'Import data from a database using SQL queries',
    icon: <FiDatabase className='h-12 w-12' />,
  },
  {
    type: 'api',
    title: 'API',
    description: 'Fetch data from a REST API endpoint',
    icon: <FiGrid className='h-12 w-12' />,
  },
  {
    type: 'excel',
    title: 'Excel File',
    description: 'Upload data from an Excel spreadsheet',
    icon: <FiFileText className='h-12 w-12' />,
  },
]

interface Props {
  selectedSource: DataSource
  selectedAPI: DataLoaderAPI | null
  selectedQuery: DataLoaderQuery | null
  isSheetOpen: boolean
  sourceName: string | null
  onSourceSelect: (source: Exclude<DataSource, null>) => void
  onSheetOpenChange: (open: boolean) => void
  onAPISelect: (api: DataLoaderAPI) => void
  onQuerySelect: (query: DataLoaderQuery) => void
  onChangeSelection: () => void
  onClearSelection: () => void
  setSourceResponseStructure: (structure: JSONStructureDefinition | null) => void
}

function DataSourceSelection({
  selectedSource,
  selectedAPI,
  selectedQuery,
  isSheetOpen,
  sourceName,
  onSourceSelect,
  onSheetOpenChange,
  onAPISelect,
  onQuerySelect,
  onChangeSelection,
  onClearSelection,
  setSourceResponseStructure,
}: Readonly<Props>) {
  const hasSelection = selectedAPI !== null || selectedQuery !== null

  const sheetTitle = useMemo(() => {
    const option = dataSourceOptions.find((opt) => opt.type === selectedSource)
    return option?.title ?? 'Setup Data Source'
  }, [selectedSource])

  const sheetDescription = useMemo(() => {
    const option = dataSourceOptions.find((opt) => opt.type === selectedSource)
    return option?.description ?? ''
  }, [selectedSource])

  return (
    <>
      {!hasSelection && (
        <div className='flex flex-col gap-4'>
          {dataSourceOptions.map((option) => (
            <div
              key={option.type}
              onClick={() => onSourceSelect(option.type)}
              className={cn(
                'flex cursor-pointer flex-row items-center gap-6 rounded-xl border-2 p-6 transition-all hover:shadow-lg',
                selectedSource === option.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              )}
            >
              <div
                className={cn(
                  'flex-shrink-0 rounded-full p-4',
                  selectedSource === option.type ? 'text-blue-600' : 'text-gray-500'
                )}
              >
                {option.icon}
              </div>
              <div className='flex-1'>
                <h4 className='mb-2 font-semibold'>{option.title}</h4>
                <p className='small-1stop text-gray-600'>{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasSelection && (
        <div className='rounded-xl border-2 border-green-500 bg-green-50 p-6'>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white'>
              <FiCheck className='h-6 w-6' />
            </div>
            <div>
              <h4 className='text-lg font-semibold text-green-900'>Data Source Selected</h4>
              <p className='small-1stop text-green-700'>{sourceName}</p>
            </div>
          </div>

          {selectedAPI && (
            <>
              <div className='mb-4 rounded-lg bg-white p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <h5 className='font-semibold text-gray-900'>{selectedAPI.name}</h5>
                  <span
                    className={cn(
                      'rounded px-2 py-0.5 text-xs font-medium',
                      selectedAPI.method === 'GET'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {selectedAPI.method}
                  </span>
                </div>
                {selectedAPI.description && (
                  <p className='small-1stop mb-2 text-gray-600'>{selectedAPI.description}</p>
                )}
                <p className='small-1stop font-mono text-gray-500'>{selectedAPI.url}</p>
              </div>
              <JsonDataViewer url={route('loader-json-api-data', selectedAPI.id)} />
            </>
          )}

          {selectedQuery != null && (
            <>
              <div className='mb-4 rounded-lg bg-white p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <FiDatabase className='h-5 w-5 text-gray-500' />
                  <h5 className='font-semibold text-gray-900'>{selectedQuery.name}</h5>
                </div>
                {selectedQuery.description && (
                  <p className='small-1stop mb-2 text-gray-600'>{selectedQuery.description}</p>
                )}
                {selectedQuery.loader_connection && (
                  <p className='small-1stop text-gray-500'>
                    Connection:{' '}
                    <span className='font-medium'>{selectedQuery.loader_connection.name}</span>
                  </p>
                )}
              </div>
              <QueryDataViewer
                url={route('loader-query-data', selectedQuery.id)}
                setResponseStructure={setSourceResponseStructure}
              />
            </>
          )}

          <div className='flex gap-3'>
            <button
              onClick={onChangeSelection}
              className='flex-1 rounded-lg border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-50'
            >
              Change Selection
            </button>
            <button
              onClick={onClearSelection}
              className='flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600'
            >
              <FiX className='h-4 w-4' />
              Clear
            </button>
          </div>
        </div>
      )}

      <Sheet
        open={isSheetOpen}
        onOpenChange={onSheetOpenChange}
      >
        <SheetContent className='w-full overflow-y-auto sm:max-w-2xl'>
          <SheetHeader>
            <SheetTitle>{sheetTitle}</SheetTitle>
            <SheetDescription>{sheetDescription}</SheetDescription>
          </SheetHeader>
          <div className='mt-6'>
            {selectedSource === 'api' && (
              <LoaderAPIPicker
                onSelect={onAPISelect}
                selectedId={selectedAPI?.id}
              />
            )}
            {selectedSource === 'sql' && (
              <LoaderQueryPicker
                onSelect={onQuerySelect}
                selectedId={selectedQuery?.id}
              />
            )}
            {selectedSource === 'excel' && (
              <p className='text-gray-600'>
                Excel file upload functionality will be added in the next step.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default DataSourceSelection
