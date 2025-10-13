import { handleHttpErrors } from '@/ui/alerts'
import { Paginator } from '@/ui/ui_interfaces'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

export default function useFetchPagination<T>(
  url: string,
  debounceDelay: number = 300
): [Paginator<T> | null, boolean] {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Paginator<T> | null>(null)

  const fetchList = useCallback(async () => {
    setLoading(true)
    setList(null)
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
    const timeoutId = setTimeout(async () => {
      await fetchList()
    }, debounceDelay)

    return () => clearTimeout(timeoutId)
  }, [fetchList, debounceDelay])

  return [list, loading]
}
