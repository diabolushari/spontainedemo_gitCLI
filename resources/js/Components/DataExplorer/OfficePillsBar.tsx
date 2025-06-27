import React, { useContext } from 'react'
import { OfficeData, SelectedOfficeContext } from '@/Pages/DataExplorer/DataExplorerPage'
import OfficePill from '@/Components/DataExplorer/OfficePill'

interface Props {
  officeLevel: string
}

const OfficePillsBar: React.FC<Props> = ({ officeLevel }) => {
  const {
    region,
    circle,
    division,
    subdivision,
    setRegion,
    setCircle,
    setDivision,
    setSubdivision,
  } = useContext(SelectedOfficeContext)

  const removeOffice = (level: string) => {
    if (level === 'region') {
      setRegion?.(null)
      setCircle?.(null)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (level === 'circle') {
      setCircle?.(null)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (level === 'division') {
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (level === 'subdivision') {
      setSubdivision?.(null)
    }
  }

  return (
    <div className='mb-2 flex flex-wrap gap-4'>
      {region != null && (
        <OfficePill
          office={region}
          levelName='Region'
          level='region'
          onClose={removeOffice}
          selectedLevel={officeLevel}
        />
      )}
      {circle != null && (
        <OfficePill
          office={circle}
          levelName='Circle'
          level='circle'
          onClose={removeOffice}
          selectedLevel={officeLevel}
        />
      )}
      {division != null && (
        <OfficePill
          office={division}
          levelName='Division'
          level='division'
          onClose={removeOffice}
          selectedLevel={officeLevel}
        />
      )}
      {subdivision != null && (
        <OfficePill
          office={subdivision}
          levelName='Subdivision'
          level='subdivision'
          onClose={removeOffice}
          selectedLevel={officeLevel}
        />
      )}
    </div>
  )
}

export default OfficePillsBar
