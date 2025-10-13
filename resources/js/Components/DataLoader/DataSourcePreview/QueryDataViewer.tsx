import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { getHttpError } from '@/ui/alerts'
import AlertMessage from '@/ui/Alert/AlertMessage'
import NormalText from '@/typography/NormalText'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import Table from '@/ui/Table/Table'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import { JSONDefinition } from '@/Components/DataLoader/SetDataStructure/SetDataStructure'

interface Props {
  url: string
  setResponseStructure?: (structure: JSONStructureDefinition) => void
}

function QueryDataViewer({ url, setResponseStructure }: Readonly<Props>) {
  const [error, setError] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [result, setResult] = useState<
    Record<string, string | number | null | undefined | boolean>[]
  >([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result: {
        data: {
          error: boolean
          errorMessage: string
          result: Record<string, string | number | null | undefined | boolean>[]
        }
      } = await axios.get(url)
      setError(result.data.error)
      setStatusMessage(result.data.errorMessage)
      setResult(result.data.result ?? [])
    } catch (error) {
      console.log(error)
      setError(true)
      const errorData = getHttpError(error)
      if (errorData != null) {
        setError(true)
        setStatusMessage(errorData)
      }
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const columns = useMemo(() => {
    const columns = result.length > 0 ? Object.keys(result[0]) : []

    let lastUUID = 1
    const fieldDefinition: JSONDefinition[] = []

    columns.forEach((column) => {
      fieldDefinition.push({
        id: ++lastUUID,
        children: [],
        field_name: column,
        field_type: 'primitive',
        primary_field: false,
      })
    })

    if (setResponseStructure != null) {
      setResponseStructure({
        last_uuid: lastUUID,
        definition: {
          id: 1,
          children: fieldDefinition,
          field_type: 'array',
          field_name: 'response',
          primary_field: true,
        },
      })
    }

    return columns
  }, [result, setResponseStructure])

  return (
    <FullSpinnerWrapper processing={loading}>
      {statusMessage != null && (
        <AlertMessage
          variant={error ? 'error' : 'success'}
          message={statusMessage}
        />
      )}
      {result.length === 10 && <NormalText>Showing first 10 results.</NormalText>}
      {!error && result.length > 0 && (
        <Table
          heads={columns}
          className='max-h-96'
        >
          <tbody className='bg-white'>
            {result.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className='border border-1stop-gray hover:bg-gray-50'
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className='data-sm-1stop whitespace-nowrap px-3 py-2'
                  >
                    {row[column] === null || row[column] === undefined ? '-' : String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {!error && result.length === 0 && statusMessage == null && (
        <NormalText>No results to display.</NormalText>
      )}
    </FullSpinnerWrapper>
  )
}

export default React.memo(QueryDataViewer)
