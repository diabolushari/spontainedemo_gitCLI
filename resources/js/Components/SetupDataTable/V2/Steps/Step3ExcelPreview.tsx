import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import Table from '@/ui/Table/Table'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'

interface Step3ExcelPreviewProps {
  file: File
  setSourceResponseStructure: (structure: JSONStructureDefinition | null) => void
  onBack: () => void
  onContinue: () => void
}

export default function Step3ExcelPreview({
  file,
  setSourceResponseStructure,
  onBack,
  onContinue,
}: Readonly<Step3ExcelPreviewProps>) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const bstr = e.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][]

        if (parsedData.length > 0) {
          const headers = parsedData[0] as string[]
          const rows = parsedData.slice(1).map((row) => {
            const obj: any = {}
            headers.forEach((h, i) => {
              obj[h] = row[i]
            })
            return obj
          })

          setColumns(headers)
          setData(rows.slice(0, 10)) // Show first 10 rows for preview

          // Set response structure for field configuration step
          const fieldDefinition = headers.map((header, index) => ({
            id: index + 2,
            children: [],
            field_name: header,
            field_type: 'primitive',
            primary_field: false,
          }))

          setSourceResponseStructure({
            last_uuid: headers.length + 1,
            definition: {
              id: 1,
              children: fieldDefinition,
              field_type: 'array',
              field_name: 'response',
              primary_field: true,
            },
          })
        } else {
          setError('The uploaded file appears to be empty.')
        }
      } catch (err) {
        console.error('Error parsing Excel file:', err)
        setError('Failed to parse Excel file. Please ensure it is a valid .xls or .xlsx file.')
      } finally {
        setLoading(false)
      }
    }

    reader.onerror = () => {
      setError('Failed to read the file.')
      setLoading(false)
    }

    reader.readAsBinaryString(file)
  }, [file, setSourceResponseStructure])

  return (
    <div>
      <h2 className='mb-5 text-lg font-semibold text-gray-900'>Excel Data Preview</h2>

      <FullSpinnerWrapper processing={loading}>
        {error && <div className='mb-4 text-red-500'>{error}</div>}

        {!error && data.length > 0 ? (
          <div className='overflow-hidden rounded-lg border border-gray-200'>
            <div className='overflow-x-auto'>
              <Table
                heads={columns}
                className='max-h-96'
              >
                <tbody className='bg-white'>
                  {data.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className='border-t border-gray-200 hover:bg-gray-50'
                    >
                      {columns.map((column) => (
                        <td
                          key={column}
                          className='whitespace-nowrap px-4 py-2 text-sm text-gray-600'
                        >
                          {row[column] === null || row[column] === undefined
                            ? '-'
                            : String(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {data.length === 10 && (
              <div className='bg-gray-50 px-4 py-2 text-xs text-gray-500'>
                Showing first 10 rows.
              </div>
            )}
          </div>
        ) : (
          !loading && <div className='py-10 text-center text-gray-500'>No data to preview.</div>
        )}
      </FullSpinnerWrapper>

      {/* Navigation Buttons */}
      <div className='mt-8 flex justify-end gap-3'>
        <button
          onClick={onBack}
          className='rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50'
        >
          Back
        </button>
        <button
          disabled={loading || data.length === 0}
          onClick={onContinue}
          className='rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Continue
        </button>
      </div>
    </div>
  )
}
