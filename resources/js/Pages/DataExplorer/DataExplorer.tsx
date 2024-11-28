import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { SubsetDetail, SubsetGroup, SubsetGroupItem } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import OfficeLevelExplorerTable from '@/Components/DataExplorer/OfficeLevelExplorerTable'
import Card from '@/ui/Card/Card'
import OfficeLevelTabs from '@/Components/DataExplorer/OfficeLevelTabs'

const tabItems = [
  { name: 'State', value: 'state' },
  { name: 'Regions', value: 'region' },
  { name: 'Circles', value: 'circle' },
  { name: 'Divisions', value: 'division' },
  { name: 'Sub Divisions *', value: 'subdivision' },
  { name: 'Sections *', value: 'section' },
]

interface Props {
  subsetGroup: SubsetGroup
  subsetItems: SubsetGroupItem[]
  oldTab: string
  oldSubsetName: string | null
  oldFilters: Record<string, string>
}

export interface OfficeData {
  office_code: string | number
  office_name: string | number
}

const initSelectedSubset = (
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

export default function DataExplorer({
  subsetGroup,
  subsetItems,
  oldTab,
  oldSubsetName,
  oldFilters,
}: Readonly<Props>) {
  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')
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

  return (
    <DashboardLayout
      type={subsetGroup.name}
      sectionCode={sectionCode}
      setSectionCode={setSectionCode}
      levelName={levelName}
      setLevelName={setLevelName}
      levelCode={levelCode}
      setLevelCode={setLevelCode}
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
                allOptionText='Select Subset'
              />
            </div>
          </div>
          <Card className='p-2'>
            <OfficeLevelTabs
              tabItems={tabItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedSubdivision={selectedSubdivision}
              selectedDivision={selectedDivision}
            />
            {selectedSubset != null && (
              <OfficeLevelExplorerTable
                subset={selectedSubset}
                officeLevel={activeTab}
                oldFilters={oldFilters}
                selectedDivision={selectedDivision}
                setSelectedDivision={setSelectedDivision}
                selectedSubdivision={selectedSubdivision}
                setSelectedSubdivision={setSelectedSubdivision}
              />
            )}
          </Card>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}
