import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { getHttpError } from '@/ui/alerts'
import AlertMessage from '@/ui/Alert/AlertMessage'
import NormalText from '@/typography/NormalText'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'

interface Props {
  url: string
}

function JsonDataViewer({ url }: Readonly<Props>) {
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

  return (
    <FullSpinnerWrapper processing={loading}>
      {statusMessage != null && (
        <AlertMessage
          variant={error ? 'error' : 'success'}
          message={statusMessage}
        />
      )}
      {result.length === 10 && <NormalText>Showing first 10 results.</NormalText>}
      {statusMessage != null && (
        <div className='max-h-96 overflow-auto bg-slate-200 p-2'>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </FullSpinnerWrapper>
  )
}

export default React.memo(JsonDataViewer)
