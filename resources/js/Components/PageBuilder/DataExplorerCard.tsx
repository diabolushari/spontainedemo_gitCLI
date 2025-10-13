import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  officeLevels,
  SubsetDateField,
  SubsetDimensionField,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'

import DataExplorerTabs from '@/Components/DataExplorer/DataExplorerTabs'
import OfficeLevelTabs from '@/Components/DataExplorer/OfficeLevelTabs'
import SubsetFilterForm from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'
import useFetchList from '@/hooks/useFetchList'
import useFetchRecord from '@/hooks/useFetchRecord'
import NormalText from '@/typography/NormalText'
import { showError } from '@/ui/alerts'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import Modal from '@/ui/Modal/Modal'
import { parseMonthYearString } from './EmptyCardBlock'

// Define the shape of OfficeData
export interface OfficeData {
  office_code: string | number
  office_name: string | number
  level?: string
}

const exampleData = {
  subset_group_id: 9,
  default_subset_id: 310,
  title: 'Sample Data',
  description: 'Sample Data Description',
  data_table_id: 35,
}

// Define the shape of DataExplorerData
export interface DataExplorerData {
  title: string
  description: string
  default_view: 'map' | 'table' | 'chart'
  data_table_id: number
  subset_group_id: number
  default_subset_id: number
}

// Context for selected office values and setters
export const SelectedOfficeContext = createContext<{
  region?: OfficeData | null
  setRegion?: Dispatch<SetStateAction<OfficeData | null>>
  circle?: OfficeData | null
  setCircle?: Dispatch<SetStateAction<OfficeData | null>>
  division?: OfficeData | null
  setDivision?: Dispatch<SetStateAction<OfficeData | null>>
  subdivision?: OfficeData | null
  setSubdivision?: Dispatch<SetStateAction<OfficeData | null>>
}>({})

interface Props {
  dataExplorerData: DataExplorerData | null
}

// Component
export default function DataExplorerCard({ dataExplorerData }: Readonly<Props>) {
  const [isLoading, setIsLoading] = useState(true)
  const [showSearchModal, setShowSearchModal] = useState(false)

  // Office level selections
  const [selectedRegion, setSelectedRegion] = useState<OfficeData | null>(null)
  const [selectedCircle, setSelectedCircle] = useState<OfficeData | null>(null)
  const [selectedDivision, setSelectedDivision] = useState<OfficeData | null>(null)
  const [selectedSubdivision, setSelectedSubdivision] = useState<OfficeData | null>(null)

  // Other state
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [activeViewTab, setActiveViewTab] = useState<'map' | 'table' | 'chart'>(
    dataExplorerData?.default_view ?? 'map'
  )
  const [activeTab, setActiveTab] = useState('region')
  const [selectedSubsetId, setSelectedSubsetId] = useState<number>(
    dataExplorerData ? dataExplorerData?.default_subset_id : exampleData.default_subset_id
  )
  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    level: 'region',
  })

  // Fetch data

  const [date] = useFetchRecord<{
    max_value?: string | null
  }>(
    dataExplorerData?.data_table_id
      ? route('data-detail.date', dataExplorerData.data_table_id)
      : route('data-detail.date', exampleData.data_table_id)
  )

  // Set default month based on fetched date
  useEffect(() => {
    if (date?.max_value) {
      const parsed = parseMonthYearString(date.max_value)
      if (parsed) {
        setSelectedMonth(parsed)
      }
    }
  }, [date])

  const [data] = useFetchList(
    `/api/data-explorer/${dataExplorerData?.subset_group_id ? dataExplorerData.subset_group_id : exampleData.subset_group_id}`
  )

  const { offices, subsetItems, subsetGroup } = data

  // Memoized selected subset
  const { selectedSubset, selectedSubsetItem } = useMemo(() => {
    if (!selectedSubsetId) {
      return {
        selectedSubset: '',
        selectedSubsetItem: null,
      }
    }
    const subsetItem = subsetItems?.find((item) => item.subset_detail_id == selectedSubsetId)
    return {
      selectedSubset: subsetItem?.subset ?? null,
      selectedSubsetItem: subsetItem ?? null,
    }
  }, [subsetItems, selectedSubsetId])

  // Reset selections on subset change
  useEffect(() => {
    setSelectedDivision(null)
    setSelectedSubdivision(null)
  }, [selectedSubset])

  // Set loading false when data is ready
  useEffect(() => {
    if (selectedSubset && selectedSubsetItem) {
      setIsLoading(false)
    }
  }, [selectedSubset, selectedSubsetItem])

  // Handle tab change with validation
  const changeTab = (tab: string) => {
    const office = offices?.find((o) => o.office_code == searchParams.office_code)
    const selectedLevel = officeLevels.find((lvl) => lvl.name === office?.level)?.level
    const targetLevel = officeLevels.find((lvl) => lvl.name === tab)?.level

    if (selectedLevel && targetLevel && selectedLevel > targetLevel) {
      showError('Please select a level lower than the current level')
      return
    }

    if (tab === 'subdivision' && selectedDivision == null) {
      showError('Please select a division first')
      return
    }

    if (tab === 'section' && selectedSubdivision == null) {
      showError('Please select a subdivision first')
      return
    }

    setActiveTab(tab)
  }

  // Handle form submission from modal
  const onSubmit = useCallback(
    (query: string | null) => {
      setShowSearchModal(false)
      if (!query) return

      const newSearchParams = new URLSearchParams(query)
      const params = Object.fromEntries(newSearchParams.entries())

      // Reset office selections if office_code changed
      if (params.office_code && params.office_code !== searchParams.office_code) {
        setSelectedRegion(null)
        setSelectedCircle(null)
        setSelectedDivision(null)
        setSelectedSubdivision(null)

        const office = offices?.find((o) => o.office_code == params.office_code)
        if (office?.level) {
          setActiveTab(office.level)
        }
      }

      setSearchParams({
        ...params,
        level: activeTab,
      })
    },
    [activeTab, offices, searchParams]
  )
  useEffect(() => {
    if (
      subsetItems?.length > 0 &&
      !subsetItems.find((i) => i.subset_detail_id == selectedSubsetId)
    ) {
      setSelectedSubsetId(subsetItems[0].subset_detail_id)
    }
  }, [subsetItems])

  // Render
  return (
    <FullSpinnerWrapper processing={isLoading}>
      <div className='flex w-full flex-col bg-white'>
        <CardHeader title={dataExplorerData?.title ?? ''} />
        <div className='px-4'>
          <NormalText>{dataExplorerData?.description}</NormalText>
        </div>

        <span className='data-xs-1stop mt-2 px-4'>
          {' '}
          <b>Note:</b> In order to view data at subdivision level and below, please filter at a
          higher organization level.
        </span>

        <SelectedOfficeContext.Provider
          value={{
            region: selectedRegion,
            setRegion: setSelectedRegion,
            circle: selectedCircle,
            setCircle: setSelectedCircle,
            division: selectedDivision,
            setDivision: setSelectedDivision,
            subdivision: selectedSubdivision,
            setSubdivision: setSelectedSubdivision,
          }}
        >
          <Card className='p-2'>
            <OfficeLevelTabs
              activeTab={activeTab}
              setActiveTab={changeTab}
              isMapView={activeViewTab === 'map'}
            />

            {selectedSubset != null && (
              <div className='min-h-screen'>
                <DataExplorerTabs
                  selectedSubset={selectedSubset}
                  selectedSubsetItem={selectedSubsetItem}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  oldFilters={{}}
                  subsetItems={subsetItems}
                  selectedSubsetId={selectedSubsetId}
                  setSelectedSubsetId={setSelectedSubsetId}
                  setShowSearchModal={setShowSearchModal}
                  activeViewTab={activeViewTab}
                  setActiveViewTab={setActiveViewTab}
                />
              </div>
            )}
          </Card>
        </SelectedOfficeContext.Provider>
        {showSearchModal && selectedSubset != null && (
          <Modal
            title='Search'
            large
            setShowModal={setShowSearchModal}
          >
            <div className='p-2'>
              <SubsetFilterForm
                dates={selectedSubset.dates as SubsetDateField[]}
                measures={selectedSubset.measures as SubsetMeasureField[]}
                dimensions={selectedSubset.dimensions as SubsetDimensionField[]}
                subset={selectedSubset}
                filters={searchParams}
                onSubmit={onSubmit}
                offices={offices}
              />
            </div>
          </Modal>
        )}
      </div>
    </FullSpinnerWrapper>
  )
}
