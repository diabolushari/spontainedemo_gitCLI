import { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { SubsetDetail, SubsetGroup, SubsetGroupItem } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import OfficeLevelExplorerTable from '@/Components/DataExplorer/OfficeLevelExplorerTable'
import Card from '@/ui/Card/Card'
import OfficeLevelTabs from '@/Components/DataExplorer/OfficeLevelTabs'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import { showError } from '@/ui/alerts'

interface Props {
  subsetGroup: SubsetGroup
  subsetItems: SubsetGroupItem[]
  oldTab: string
  oldSubsetName: string | null
  oldFilters: Record<string, string>
  oldRoute?: string
}

export interface OfficeData {
  office_code: string | number
  office_name: string | number
}

export const initSelectedSubset = (
  subsetGroupItems: SubsetGroupItem[],
  oldSubsetName: string | null
): string => {
  if (subsetGroupItems.length === 0) {
    return ''
  }
  if (oldSubsetName == null) {
    return subsetGroupItems[0].id.toString()
  }
  //find the one with matching name
  const subset = subsetGroupItems.find(
    (subset) => subset.name.toLowerCase() == oldSubsetName.toLowerCase()
  )
  if (subset != null) {
    return subset.id.toString()
  }
  return subsetGroupItems[0].id.toString()
}

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

export default function DataExplorerPage({
  subsetGroup,
  subsetItems,
  oldTab,
  oldSubsetName,
  oldFilters,
  oldRoute,
}: Readonly<Props>) {
  const breadCrumb: BreadcrumbItemLink[] = useMemo(() => {
    return [
      {
        item: 'Home',
        link: oldRoute ?? route('service-delivery.index'),
      },
      {
        item: subsetGroup.name,
        link: '',
      },
    ]
  }, [oldRoute, subsetGroup.name])

  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<OfficeData | null>(null)
  const [selectedCircle, setSelectedCircle] = useState<OfficeData | null>(null)
  const [selectedDivision, setSelectedDivision] = useState<OfficeData | null>(null)
  const [selectedSubdivision, setSelectedSubdivision] = useState<OfficeData | null>(null)

  const [selectedSubsetId, setSelectedSubsetId] = useState(
    initSelectedSubset(subsetItems, oldSubsetName)
  )

  const [activeTab, setActiveTab] = useState(oldTab)

  const selectedSubset = useMemo(() => {
    if (selectedSubsetId === '') {
      return null
    }
    return subsetItems.find((subsetItem) => subsetItem.id.toString() == selectedSubsetId)
      ?.subset as SubsetDetail | null | undefined
  }, [subsetItems, selectedSubsetId])

  useEffect(() => {
    setSelectedDivision(null)
    setSelectedSubdivision(null)
  }, [selectedSubset, setSelectedDivision, setSelectedSubdivision])

  const changeTab = (tab: string) => {
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

  return (
    <DashboardLayout
      type={subsetGroup.name}
      sectionCode={sectionCode}
      setSectionCode={setSectionCode}
      levelName={levelName}
      setLevelName={setLevelName}
      levelCode={levelCode}
      setLevelCode={setLevelCode}
      breadCrumbs={breadCrumb}
    >
      <DashboardPadding>
        <div className='flex w-full flex-col gap-5 pl-12 pt-8 sm:pt-24'>
          <div className='grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
            <div className='flex flex-col'>
              <SelectList
                list={subsetItems}
                dataKey='id'
                displayKey='name'
                setValue={setSelectedSubsetId}
                value={selectedSubsetId}
                showAllOption
                label='Select An Analysis Set'
                allOptionText='Select Subset'
              />
            </div>
          </div>
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
              />
              {selectedSubset != null && (
                <OfficeLevelExplorerTable
                  subset={selectedSubset}
                  officeLevel={activeTab}
                  oldFilters={oldFilters}
                  setActiveTab={setActiveTab}
                />
              )}
            </Card>
          </SelectedOfficeContext.Provider>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}
