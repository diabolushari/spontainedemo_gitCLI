import { useMemo } from 'react'

export const useNameUrl = (name: string | null) => {
  return useMemo(() => {
    if (name == null) {
      return ''
    }
    const url = name.split(' ').join('-')
    return url == null ? '' : url.replace(/[^a-z0-9-]/gi, '').toLowerCase()
  }, [name])
}

export default useNameUrl
