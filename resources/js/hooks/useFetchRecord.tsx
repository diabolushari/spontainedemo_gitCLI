import { handleHttpErrors } from '@/ui/alerts'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

export default function useFetchRecord<T>(url: string | null): [T | null, boolean] {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<T | null>(null)

  const fetchList = useCallback(async () => {
    setList(null)
    if (url == null) {
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.get(url)
      setList(data)
    } catch (error) {
      handleHttpErrors(error)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  return [list, loading]
}
