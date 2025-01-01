import useFetchRecord from '@/hooks/useFetchRecord'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'

interface Props {
  listFetchURL: string
  selectedValue: string
  setSelectedValue: Dispatch<SetStateAction<string>>
  dataKey: string
}

export default function FieldUniqueValueDropdown({
  listFetchURL,
  selectedValue,
  setSelectedValue,
  dataKey,
}: Readonly<Props>) {
  const [rankingData] = useFetchRecord<{
    data: Record<string, string | number | null | undefined>[]
  }>(listFetchURL)

  console.log(rankingData)

  const [list, setList] = useState<{ value: string }[]>([])

  useEffect(() => {
    const listItems: { value: string }[] = []
    rankingData?.data?.map((item) => {
      if (item[dataKey] == null) {
        return
      }
      //check if already in list
      const index = listItems.findIndex((listItem) => listItem.value === item[dataKey])
      if (index === -1) {
        listItems.push({
          value: item[dataKey] as string,
        })
      }
    })
    setList(listItems)
  }, [rankingData, dataKey])

  useEffect(() => {
    //if selected value is not in list add it
    if (selectedValue == '') {
      return
    }
    const index = list.findIndex((listItem) => listItem.value === selectedValue)
    if (index === -1) {
      setList((oldValues) => {
        return [{ value: selectedValue }, ...oldValues]
      })
    }
  }, [list, selectedValue])

  return (
    <div className='flex flex-col'>
      <SelectList
        setValue={setSelectedValue}
        list={list}
        displayKey='value'
        dataKey='value'
        value={selectedValue}
        style='1stop-small'
      />
    </div>
  )
}
