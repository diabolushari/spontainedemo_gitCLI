import React, { useCallback, useState } from 'react'
import axios from 'axios'
import { getHttpError } from '@/ui/alerts'
import Button from '@/ui/button/Button'
import AlertMessage from '@/ui/Alert/AlertMessage'
import NormalText from '@/typography/NormalText'
import Card from '@/ui/Card/Card'

interface Props {
  url: string
}

function DataSourcePreview({ url }: Readonly<Props>) {
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
      console.log(result)
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

  return (
    <Card className='my-10 px-2 py-5'>
      <div className='my-5 flex'>
        <Button
          label='Test Query'
          onClick={fetchData}
          processing={loading}
        />
      </div>
      {statusMessage != null && (
        <AlertMessage
          variant={error ? 'error' : 'success'}
          message={statusMessage}
        />
      )}
      {result.length === 10 && <NormalText>Showing first 10 results.</NormalText>}
      {statusMessage != null && (
        <div className='bg-slate-200 p-2'>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </Card>
  )
}

export default React.memo(DataSourcePreview)
