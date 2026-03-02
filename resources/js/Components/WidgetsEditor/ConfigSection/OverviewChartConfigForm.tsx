import DynamicSelectList from '@/ui/form/DynamicSelectList'
import ChartTypeSelector from '@/Components/WidgetsEditor/ConfigSection/ChartTypeSelector'
import MeasureFieldSelector from '../ConfigMeasures/MeasureFieldSelector'
import ColorPaletteSelector from '@/Components/WidgetsEditor/ConfigSection/ColorPalettSelector'
import { WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useFetchList from '@/hooks/useFetchList'
import SelectList from '@/ui/form/SelectList'
import ComboBox from '@/ui/form/ComboBox'
import { SubsetDetail } from '@/interfaces/data_interfaces'
import axios from 'axios'

interface OverviewChartSectionProps {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
  ai_agent?: boolean
  widget_data_url: string
}

export default function OverviewChartConfigForm({
  formData,
  setFormValue,
  ai_agent,
  widget_data_url,
}: Readonly<OverviewChartSectionProps>) {
  const [fieldName, setFieldName] = useState<any>(null)
  const [selectedHierarchy, setSelectedHierarchy] = useState<any>(null)

  const [subset, setSubset] = useState<SubsetDetail | Record<string, any> | null>({
    id: Number(formData?.subset_id),
    name: formData?.subset_name,
  })

  const [hierarchyOptions, setHierarchyOptions] = useState<any[]>([])
  const [hierarchyItem, setHierarchyItem] = useState<any>(
    formData.hierarchy_item_id
      ? { id: formData?.hierarchy_item_id, name: formData?.hierarchy_item_name }
      : null
  )

  const handleSubsetChangeAi = useCallback(
    (value: SubsetDetail | Record<string, any> | null) => {
      setSubset(value)
      setFormValue('subset_id')(value?.id ?? '')
    },
    [setFormValue]
  )

  const handleSubsetChange = useCallback(
    (newSubsetId: string | null) => {
      setFormValue('measures')([])
      setFormValue('dimension')('')
      setFormValue('hierarchy_id')(null)
      setFormValue('hierarchy_item_id')(null)
      setHierarchyItem(null)
      setFormValue('subset_id')(newSubsetId ?? '')
    },
    [setFormValue]
  )

  // 1. Fetch and filter dimensions
  const dimensionUrl = formData.subset_id
    ? `${widget_data_url}/api/subset/dimension/${formData.subset_id}`
    : null
  const [rawDimensions] = useFetchList<{
    id: number
    subset_field_name: string
    subset_column: string
    hierarchy_id: number | null
  }>(dimensionUrl)

  const filteredDimensions = useMemo(() => {
    if (!Array.isArray(rawDimensions)) return []
    return rawDimensions.filter(
      (dim) =>
        !dim.subset_column?.toLowerCase().includes('month') &&
        !dim.subset_field_name?.toLowerCase().includes('month')
    )
  }, [rawDimensions])

  // 2. Fetch Hierarchy Options
  useEffect(() => {
    const fetchSubsetFieldsAndHierarchies = async () => {
      if (!formData.subset_id) {
        setHierarchyOptions([])
        return
      }

      try {
        const response = await axios.get(
          `${widget_data_url}/subset-fields?subset_id=${formData.subset_id}`
        )
        const dimensions = response.data.dimensions

        const validDimensions = dimensions.filter((d: any) => d.hierarchy_id != null)

        const hierarchyIds = [
          ...new Set(validDimensions.map((d: any) => d.hierarchy_id)),
        ] as number[]

        if (hierarchyIds.length === 0) {
          setHierarchyOptions([])
          return
        }

        const hierarchyPromises = hierarchyIds.map((id) =>
          axios.get(`${widget_data_url}/meta-hierarchy-data/${id}`)
        )
        const hierarchyResponses = await Promise.all(hierarchyPromises)
        const hierarchyData = hierarchyResponses.map((res) => res.data)

        setHierarchyOptions(hierarchyData)
      } catch (error) {
        console.error('Failed to fetch subset fields or hierarchy details:', error)
        setHierarchyOptions([])
      }
    }

    fetchSubsetFieldsAndHierarchies()
  }, [formData.subset_id, widget_data_url])

  const handleHierarchyChange = (value: string) => {
    setFormValue('hierarchy_id')(value)
    setFormValue('overview_level')('')
    setFormValue('hierarchy_item_id')(null)
    setHierarchyItem(null)
  }

  const handleHierarchyItemChange = useCallback(
    (value: any) => {
      setHierarchyItem(value)
      setFormValue('hierarchy_item_id')(value?.id ?? null)
      setFormValue('hierarchy_item_name')(value?.name ?? null)
    },
    [setFormValue]
  )

  useEffect(() => {
    if (formData.hierarchy_id) {
      axios.get(`${widget_data_url}/meta-hierarchy-data/${formData.hierarchy_id}`).then((res) => {
        setSelectedHierarchy(res.data)
        setFieldName([
          {
            id: 1,
            column: res.data.primary_column,
            name: res.data.primary_field_name,
          },
          {
            id: 2,
            column: res.data.secondary_column,
            name: res.data.secondary_field_name,
          },
        ])
      })
    }
  }, [formData.hierarchy_id])

  return (
    <div className='space-y-4 px-4'>
      <ChartTypeSelector
        selectedType={formData.chart_type}
        onTypeChange={setFormValue('chart_type')}
      />

      {/* Subset Selector */}
      <div className='flex flex-col'>
        {ai_agent ? (
          <ComboBox
            label='Subset'
            url={`${widget_data_url}${route('subset.list', { search: '' }, false)}`}
            dataKey='id'
            displayKey='name'
            value={subset}
            setValue={handleSubsetChangeAi}
          />
        ) : (
          <DynamicSelectList
            label='Subset'
            url={`${widget_data_url}${route('subset-having-dimension-measure', formData.subset_group_id, false)}`}
            dataKey='id'
            displayKey='name'
            value={formData.subset_id}
            setValue={handleSubsetChange}
          />
        )}
      </div>

      {/* Dimension Selector */}
      <div>
        <SelectList
          label='Dimension'
          list={filteredDimensions}
          dataKey='subset_column'
          displayKey='subset_field_name'
          value={formData.dimension ?? ''}
          setValue={(value) => {
            setFormValue('dimension')(value)
            const dim = filteredDimensions.find((dim) => dim.subset_column === value)
            setFormValue('hierarchy_id')(dim?.hierarchy_id ? String(dim.hierarchy_id) : '')
            setFormValue('hierarchy_item_id')(null)
            setFormValue('hierarchy_item_name')(null)
            setFormValue('overview_level')(null)
            setHierarchyItem(null)
          }}
        />
      </div>

      {/* Measure Field Selector (Required - Moved Up) */}
      <div className='flex flex-col'>
        <MeasureFieldSelector
          subsetId={formData.subset_id}
          measures={formData.measures}
          onMeasuresChange={(measures) => setFormValue('measures')(measures)}
          showUnit={true}
          allowMultiple={formData.chart_type !== 'pie'}
        />
      </div>

      {/* Hierarchy Selector (Optional - Moved Down) */}
      {hierarchyOptions.length > 0 && (
        <div className='border-t border-gray-100 pt-2'>
          <div className='mb-2'>
            <label className='text-xs font-medium uppercase tracking-wider text-gray-500'>
              Optional Filters
            </label>
          </div>
          <div className='space-y-4'>
            {/* Hierarchy Item Search */}
            {formData.hierarchy_id && (
              <div className='flex flex-col gap-4'>
                {fieldName && (
                  <div>
                    <SelectList
                      label='X Axis Label'
                      list={fieldName}
                      dataKey='column'
                      displayKey='name'
                      setValue={setFormValue('overview_name_field')}
                      value={formData.overview_name_field}
                    />
                  </div>
                )}
                <div>
                  <ComboBox
                    label='Hierarchy Item'
                    url={`${widget_data_url}/meta-hierarchy-item-search?hierarchy_id=${formData.hierarchy_id}&search=`}
                    dataKey='id'
                    displayKey='name'
                    value={hierarchyItem}
                    setValue={handleHierarchyItemChange}
                    placeholder='Search hierarchy items...'
                  />
                </div>

                <div>
                  <DynamicSelectList
                    label={'Level'}
                    url={`${widget_data_url}/meta-hierarchy/${formData.hierarchy_id}/levels`}
                    dataKey={'name'}
                    displayKey={'name'}
                    setValue={setFormValue('overview_level')}
                    value={formData.overview_level ?? undefined}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ColorPaletteSelector
        selectedPalette={formData.color_palette}
        onPaletteChange={setFormValue('color_palette')}
      />

      <div className='flex flex-col'></div>
    </div>
  )
}
