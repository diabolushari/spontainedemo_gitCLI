import { useCallback, useEffect, useState } from 'react'
import { handleHttpErrors } from '@/ui/alerts'
import axios from 'axios'

export default function useFetchList<T>(url: string | null): [T[], boolean] {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<T[]>([])

  const fetchList = useCallback(async () => {
    setList([])
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
