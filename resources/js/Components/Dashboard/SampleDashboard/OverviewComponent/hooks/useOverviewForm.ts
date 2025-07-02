import { useEffect, useState } from 'react'
import {
  SubsetDimensionField,
  SubsetGroupItem,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'

interface DimensionFilter {
  name: string
}

export function useOverviewForm(subsetGroupId: number, isModalOpen: boolean) {
  // State for form fields and data
  const [title, setTitle] = useState('')
  const [subsets, setSubsets] = useState<SubsetGroupItem[]>([])
  const [metrics, setMetrics] = useState<SubsetMeasureField[]>([])
  const [dimensions, setDimensions] = useState<SubsetDimensionField[]>([])
  const [dimensionFilters, setDimensionFilters] = useState<DimensionFilter[]>([])

  // State for user selections
  const [selectedSubsetDetailId, setSelectedSubsetDetailId] = useState<number | ''>('')
  const [selectedMetric, setSelectedMetric] = useState('')
  const [selectedDimension, setSelectedDimension] = useState('')
  const [selectedDimensionFilter, setSelectedDimensionFilter] = useState('')

  // State for loading and error UI
  const [isLoading, setIsLoading] = useState({ subsets: false, details: false, filters: false })
  const [error, setError] = useState<string | null>(null)

  // Fetch Subsets when modal opens
  useEffect(() => {
    if (isModalOpen && subsetGroupId) {
      const fetchSubsets = async () => {
        setIsLoading((prev) => ({ ...prev, subsets: true }))
        setError(null)
        try {
          const res = await fetch(`/api/subset-group/${subsetGroupId}`)
          if (!res.ok) throw new Error('Failed to fetch subsets')
          setSubsets((await res.json()) as SubsetGroupItem[])
        } catch (e) {
          setError('Could not load subsets.')
        } finally {
          setIsLoading((prev) => ({ ...prev, subsets: false }))
        }
      }
      fetchSubsets()
    }
  }, [isModalOpen, subsetGroupId])

  // Fetch Metrics AND Dimensions when a subset is selected
  useEffect(() => {
    if (!selectedSubsetDetailId) return
    const fetchDetails = async () => {
      setMetrics([])
      setDimensions([])
      setSelectedMetric('')
      setSelectedDimension('')
      setIsLoading((prev) => ({ ...prev, details: true }))
      try {
        const metricsRes = await fetch(`/api/subset/${selectedSubsetDetailId}`)
        if (!metricsRes.ok) throw new Error('Failed to fetch metrics')
        setMetrics((await metricsRes.json()) as SubsetMeasureField[])

        const dimRes = await fetch(`/api/subset/dimension/${selectedSubsetDetailId}`)
        if (!dimRes.ok) throw new Error('Failed to fetch dimensions')
        setDimensions((await dimRes.json()) as SubsetDimensionField[])
      } catch (e) {
        setError('Could not load details for this subset.')
      } finally {
        setIsLoading((prev) => ({ ...prev, details: false }))
      }
    }
    fetchDetails()
  }, [selectedSubsetDetailId])

  // Fetch Dimension Filters when a dimension is selected
  useEffect(() => {
    if (!selectedDimension || !selectedSubsetDetailId) return
    const fetchFilters = async () => {
      setDimensionFilters([])
      setSelectedDimensionFilter('')
      setIsLoading((prev) => ({ ...prev, filters: true }))
      try {
        const res = await fetch(
          `/api/subset/dimension/fields/${selectedDimension}/${selectedSubsetDetailId}`
        )
        if (!res.ok) throw new Error('Failed to fetch dimension filters')
        setDimensionFilters((await res.json()) as DimensionFilter[])
      } catch (e) {
        setError('Could not load filters for this dimension.')
      } finally {
        setIsLoading((prev) => ({ ...prev, filters: false }))
      }
    }
    fetchFilters()
  }, [selectedDimension, selectedSubsetDetailId])

  function resetAllState() {
    setTitle('')
    setSelectedSubsetDetailId('')
    setSubsets([])
    setMetrics([])
    setDimensions([])
    setDimensionFilters([])
    setSelectedMetric('')
    setSelectedDimension('')
    setSelectedDimensionFilter('')
    setError(null)
  }

  // Return everything the form component will need
  return {
    // Form State & Data
    title,
    subsets,
    metrics,
    dimensions,
    dimensionFilters,
    // Selections
    selectedSubsetDetailId,
    selectedMetric,
    selectedDimension,
    selectedDimensionFilter,
    // Setters
    setTitle,
    setSelectedSubsetDetailId,
    setSelectedMetric,
    setSelectedDimension,
    setSelectedDimensionFilter,
    // UI State
    isLoading,
    error,
    // Methods
    resetAllState,
  }
}
