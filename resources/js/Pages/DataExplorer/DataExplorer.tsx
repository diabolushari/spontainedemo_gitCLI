import { useMemo, useState } from 'react'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Tab from '@/ui/Tabs/Tab'
import { SubsetDetail, SubsetGroup } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import OfficeLevelExplorerTable from '@/Components/DataExplorer/OfficeLevelExplorerTable'
import Card from '@/ui/Card/Card'

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
  subsets: SubsetDetail[]
  oldTab: string
  oldSubsetName: string | null
}

const initSelectedSubset = (subsets: SubsetDetail[], oldSubsetName: string | null): string => {
  if (subsets.length === 0) {
    return ''
  }
  if (oldSubsetName == null) {
    return subsets[0].id.toString()
  }
  //find the one with matching name
  const subset = subsets.find((subset) => subset.name.toLowerCase() == oldSubsetName.toLowerCase())
  if (subset != null) {
    return subset.id.toString()
  }
  return subsets[0].id.toString()
}

export default function DataExplorer({
  subsetGroup,
  subsets,
  oldTab,
  oldSubsetName,
}: Readonly<Props>) {
  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')

  const [selectedSubsetId, setSelectedSubsetId] = useState(
    initSelectedSubset(subsets, oldSubsetName)
  )

  const [activeTab, setActiveTab] = useState(oldTab)

  const selectedSubset = useMemo(() => {
    if (selectedSubsetId === '') {
      return null
    }
    return subsets.find((subset) => subset.id.toString() == selectedSubsetId)
  }, [subsets, selectedSubsetId])

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
                list={subsets}
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
            <Tab
              tabItems={tabItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {selectedSubset != null && (
              <OfficeLevelExplorerTable
                subset={selectedSubset}
                officeLevel={activeTab}
              />
            )}
          </Card>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}
