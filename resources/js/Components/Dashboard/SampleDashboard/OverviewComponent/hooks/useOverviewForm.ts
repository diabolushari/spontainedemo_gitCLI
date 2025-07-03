import { useCallback, useEffect, useState } from 'react'
import {
  SubsetDimensionField,
  SubsetGroupItem,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'

// This interface describes a single filter value fetched from the API.
interface DimensionValue {
  name: string
}

// This interface defines the structure for a single filter row in the UI.
export interface Filter {
  id: number
  dimension: string
  operator: string
  value: string
}

type FetchError = Error & { info?: string }

export function useOverviewForm(subsetGroupId: number, isModalOpen: boolean) {
  const [title, setTitle] = useState('')
  const [subsets, setSubsets] = useState<SubsetGroupItem[]>([])
  const [metrics, setMetrics] = useState<SubsetMeasureField[]>([])
  const [dimensions, setDimensions] = useState<SubsetDimensionField[]>([])
  const [selectedSubsetDetailId, setSelectedSubsetDetailId] = useState<number | ''>('')
  const [selectedMetric, setSelectedMetric] = useState('')
  const [filters, setFilters] = useState<Filter[]>([])
  const [nextFilterId, setNextFilterId] = useState(1)
  const [availableValues, setAvailableValues] = useState<Record<string, DimensionValue[]>>({})
  const [isLoading, setIsLoading] = useState({
    subsets: false,
    details: false,
    values: {} as Record<string, boolean>,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isModalOpen && subsetGroupId) {
      const fetchSubsets = async () => {
        setIsLoading((prev) => ({ ...prev, subsets: true }))
        setError(null)
        try {
          const res = await fetch(`/api/subset-group/${subsetGroupId}`)
          if (!res.ok) throw new Error('Failed to fetch subsets')
          setSubsets((await res.json()) as SubsetGroupItem[])
        } catch (e: unknown) {
          const err = e as FetchError
          setError(`Could not load subsets: ${err.message}`)
        } finally {
          setIsLoading((prev) => ({ ...prev, subsets: false }))
        }
      }
      void fetchSubsets()
    }
  }, [isModalOpen, subsetGroupId])

  useEffect(() => {
    if (!selectedSubsetDetailId) return
    const fetchDetails = async () => {
      setMetrics([])
      setDimensions([])
      setSelectedMetric('')
      setFilters([])
      setAvailableValues({})
      setIsLoading((prev) => ({ ...prev, details: true, values: {} }))
      try {
        const metricsRes = await fetch(`/api/subset/${selectedSubsetDetailId}`)
        if (!metricsRes.ok) throw new Error('Failed to fetch metrics')
        setMetrics((await metricsRes.json()) as SubsetMeasureField[])

        const dimRes = await fetch(`/api/subset/dimension/${selectedSubsetDetailId}`)
        if (!dimRes.ok) throw new Error('Failed to fetch dimensions')
        setDimensions((await dimRes.json()) as SubsetDimensionField[])
      } catch (e: unknown) {
        const err = e as FetchError
        setError(`Could not load details for this subset: ${err.message}`)
      } finally {
        setIsLoading((prev) => ({ ...prev, details: false }))
      }
    }
    void fetchDetails()
  }, [selectedSubsetDetailId])

  const fetchValuesForDimension = useCallback(
    async (dimensionColumn: string) => {
      if (!dimensionColumn || !selectedSubsetDetailId || availableValues[dimensionColumn]) return
      setIsLoading((prev) => ({ ...prev, values: { ...prev.values, [dimensionColumn]: true } }))
      try {
        const res = await fetch(
          `/api/subset/dimension/fields/${dimensionColumn}/${selectedSubsetDetailId}`
        )
        if (!res.ok) throw new Error(`Failed to fetch values for ${dimensionColumn}`)
        const values = (await res.json()) as DimensionValue[]
        setAvailableValues((prev) => ({ ...prev, [dimensionColumn]: values }))
      } catch (e: unknown) {
        const err = e as FetchError
        setError(`Could not load filter values: ${err.message}`)
      } finally {
        setIsLoading((prev) => ({ ...prev, values: { ...prev.values, [dimensionColumn]: false } }))
      }
    },
    [selectedSubsetDetailId, availableValues]
  )

  const addFilter = () => {
    setFilters((prev) => [
      ...prev,
      { id: nextFilterId, dimension: '', operator: 'equals', value: '' },
    ])
    setNextFilterId((prev) => prev + 1)
  }

  const removeFilter = (id: number) => {
    setFilters((prev) => prev.filter((f) => f.id !== id))
  }

  const updateFilter = (id: number, field: keyof Omit<Filter, 'id'>, value: string) => {
    setFilters((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updatedFilter = { ...f, [field]: value }
          if (field === 'dimension') {
            updatedFilter.value = ''
            void fetchValuesForDimension(value)
          }
          return updatedFilter
        }
        return f
      })
    )
  }

  function resetAllState() {
    setTitle('')
    setSelectedSubsetDetailId('')
    setSubsets([])
    setMetrics([])
    setDimensions([])
    setSelectedMetric('')
    setFilters([])
    setAvailableValues({})
    setNextFilterId(1)
    setError(null)
  }

  return {
    title,
    setTitle,
    subsets,
    metrics,
    selectedMetric,
    setSelectedMetric,
    dimensions,
    selectedSubsetDetailId,
    setSelectedSubsetDetailId,
    filters,
    addFilter,
    removeFilter,
    updateFilter,
    availableValues,
    isLoading,
    error,
    resetAllState,
  }
}
