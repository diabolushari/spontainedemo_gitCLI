import MeasureFieldSelector from '@/Components/WidgetsEditor/ConfigMeasures/MeasureFieldSelector'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import ComboBox from '@/ui/form/ComboBox'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SelectedMeasure, WidgetFormData } from '../OverviewWidgetEditor'
import SelectList from '@/ui/form/SelectList'
import axios from 'axios'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { Info } from 'lucide-react'
import { SubsetDetail } from '@/interfaces/data_interfaces'

interface RankingConfigSectionProps {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
  metaHierarchy: MetaHierarchy[]
  ai_agent?: boolean
}

export function RankingConfigSection({
  formData,
  setFormValue,
  metaHierarchy,
  ai_agent,
}: Readonly<RankingConfigSectionProps>) {
  const [dimensions, setDimensions] = useState<any[]>([])
  const [fieldName, setFieldName] = useState<any>(null)
  const [selectedHierarchy, setSelectedHierarchy] = useState<any>(null)

  useEffect(() => {
    if (formData.rank_subset_id) {
      axios.get(`/subset-fields?subset_id=${formData.rank_subset_id}`).then((res) => {
        const dims = res.data.dimensions.filter(
          (d: any) => d.subset_column !== 'month' && d.hierarchy_id != null
        )
        setDimensions(dims)
        console.log('dims : ', dims)
      })
    }
  }, [formData.rank_subset_id])

  useEffect(() => {
    if (formData.rank_hierarchy_id) {
      axios.get(`/meta-hierarchy-data/${formData.rank_hierarchy_id}`).then((res) => {
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
  }, [formData.rank_hierarchy_id])

  const selectedMeasures = useMemo(() => {
    return formData.rank_ranking_field == null ? [] : [formData.rank_ranking_field]
  }, [formData.rank_ranking_field])

  const updateMeasures = useCallback(
    (measures: SelectedMeasure[]) => {
      if (measures.length > 0) {
        setFormValue('rank_ranking_field')(measures[0])
        return
      }
      setFormValue('rank_ranking_field')(null)
    },
    [setFormValue]
  )

  const handleSubsetChange = useCallback(
    (value: string) => {
      setFormValue('rank_subset_id')(value)
      setFormValue('rank_ranking_field')(null)
    },
    [setFormValue]
  )
  const [subset, setSubset] = useState<SubsetDetail | Record<string, any> | null>({
    id: Number(formData.rank_subset_id),
    name: formData.rank_subset_name,
  })
  const handleSubsetChangeAi = useCallback(
    (value: SubsetDetail) => {
      setSubset(value)
      setFormValue('rank_subset_id')(value.id.toString())
      setFormValue('rank_ranking_field')(null)
    },
    [setFormValue]
  )

  const handleDimensionChange = useCallback(
    (value: string) => {
      setFormValue('rank_dimension_column')(value)
      const selectedDimension = dimensions.find((d) => d.subset_column === value)
      if (selectedDimension?.hierarchy_id) {
        setFormValue('rank_hierarchy_id')(selectedDimension.hierarchy_id)
      }
    },
    [dimensions]
  )

  return (
    <div className='space-y-4 px-4'>
      <div className='flex flex-col'>
        {ai_agent ? (
          <ComboBox
            label='Subset'
            url={route('subset.list', {
              search: '',
            })}
            dataKey='id'
            displayKey='name'
            value={subset}
            setValue={handleSubsetChangeAi}
          />
        ) : (
          <DynamicSelectList
            label='Subset'
            url={`/api/subset-group/${formData?.subset_group_id}`}
            dataKey='id'
            displayKey='name'
            value={formData.rank_subset_id}
            setValue={handleSubsetChange}
          />
        )}
      </div>
      {/* <div>
        <SelectList
          label='Hierarchy'
          list={metaHierarchy}
          dataKey='id'
          displayKey='name'
          setValue={setFormValue('rank_hierarchy_id')}
          value={formData.rank_hierarchy_id}
        />
      </div> */}
      <div className='flex flex-col'>
        <div className='mb-1 flex items-center gap-2'>
          <label className='standard-label small-1stop'>Dimension</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className='h-4 w-4 text-gray-500' />
              </TooltipTrigger>
              <TooltipContent>
                <p>Dimensions shown here are only those which have a hierarchy connected</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <SelectList
          label='Dimension'
          list={dimensions}
          dataKey='subset_column'
          displayKey='subset_field_name'
          setValue={handleDimensionChange}
          value={formData.rank_dimension_column ?? undefined}
          showLabel={false}
        />
        {selectedHierarchy && (
          <div className='mb-1 flex items-center gap-2'>
            <label className='standard-label small-1stop'>Hierarchy</label>
            <span>{selectedHierarchy.name}</span>
          </div>
        )}
      </div>
      <div>
        <MeasureFieldSelector
          subsetId={formData.rank_subset_id}
          measures={selectedMeasures}
          onMeasuresChange={updateMeasures}
          allowMultiple={false}
        />
      </div>
      {fieldName && (
        <div>
          <SelectList
            label='Name Field'
            list={fieldName}
            dataKey='column'
            displayKey='name'
            setValue={setFormValue('rank_field_column')}
            value={formData.rank_field_column}
          />
        </div>
      )}
      {selectedHierarchy && (
        <div className='flex flex-col'>
          <DynamicSelectList
            label={'Default Level'}
            url={`/meta-hierarchy/${formData.rank_hierarchy_id}/levels`}
            dataKey={'name'}
            displayKey={'name'}
            setValue={setFormValue('rank_level')}
            value={formData.rank_level}
          />
        </div>
      )}
    </div>
  )
}
