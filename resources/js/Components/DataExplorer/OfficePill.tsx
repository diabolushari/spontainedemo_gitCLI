import { OfficeData } from '@/Pages/DataExplorer/DataExplorerPage'
import React, { useMemo } from 'react'

interface Props {
  office: OfficeData
  levelName: string
  level: string
  selectedLevel: string
  onClose: (level: string) => void
}

const officeLevels = [
  { id: 1, level: 'state' },
  { id: 2, level: 'region' },
  { id: 3, level: 'circle' },
  { id: 4, level: 'division' },
  { id: 5, level: 'subdivision' },
  { id: 6, level: 'section' },
]

export default function OfficePill({
  office,
  levelName,
  level,
  onClose,
  selectedLevel,
}: Readonly<Props>) {
  const isVisible = useMemo(() => {
    const levelInfo = officeLevels.find((officeLevel) => officeLevel.level === level)
    const selectedLevelInfo = officeLevels.find(
      (officeLevel) => officeLevel.level === selectedLevel
    )
    if (selectedLevelInfo == null || levelInfo == null) {
      return false
    }
    return selectedLevelInfo.id >= levelInfo.id
  }, [selectedLevel, level])

  return (
    <>
      {isVisible && (
        <div className='flex'>
          <div className='flex items-center justify-between gap-5 rounded-xl border-2 border-1stop-gray bg-1stop-white p-2'>
            <span className='text-xs'>
              {levelName} <i>equals</i>{' '}
              <b>
                {office?.office_name} ({office?.office_code})
              </b>
            </span>
            <button
              className=''
              onClick={() => onClose(level)}
            >
              <i className='la la-close' />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
